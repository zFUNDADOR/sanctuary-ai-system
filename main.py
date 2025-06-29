# main.py - Servidor Backend Python com Flask

# Adicione estas duas linhas aqui, no topo do seu arquivo, logo após as importações iniciais do Python
from dotenv import load_dotenv
load_dotenv(dotenv_path='secrets.env') # Carrega as variáveis do secrets.env

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import io # Para lidar com BLOBs (embeddings)
import random # Para simular a força de influência
import re # Para extração simples de frases/palavras
import json # Para analisar a resposta JSON do LLM

# Importa as bibliotecas para interagir com a Gemini API e Firebase Admin SDK
import google.generativeai as genai
import os # Para acessar variáveis de ambiente, se necessário

# Importações para o Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Configura sua chave de API para o Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY")) 

# O modelo padrão que podemos usar no Replit/Canvas é o gemini-2.0-flash
GEMINI_MODEL = "gemini-2.0-flash"

app = Flask(__name__)
CORS(app)

# ===========================
# INICIALIZAÇÃO DO FIREBASE ADMIN SDK
# ===========================
try:
    # Acessa a chave de conta de serviço do Firebase a partir das variáveis de ambiente
    # É CRUCIAL que o conteúdo do JSON da chave seja salvo como uma única string
    # no valor do Secret no Replit, sem quebras de linha ou caracteres extras.
    firebase_service_account_str = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY")
    if not firebase_service_account_str:
        raise ValueError("FIREBASE_SERVICE_ACCOUNT_KEY não está configurada nas variáveis de ambiente.")
    
    # Converte a string JSON para um dicionário Python
    firebase_service_account_info = json.loads(firebase_service_account_str)

    cred = credentials.Certificate(firebase_service_account_info)
    firebase_admin.initialize_app(cred)
    db_firestore = firestore.client() # Obtém o cliente Firestore
    print("Firebase Admin SDK inicializado e conectado ao Firestore.")
except Exception as e:
    print(f"Erro ao inicializar Firebase Admin SDK: {e}")
    db_firestore = None # Define como None para indicar que o Firestore não está disponível

# ===========================
# CONEXÃO COM BANCO DE DADOS (SQLite - para embeddings, se ainda usar)
# ===========================
def conectar_banco(nome_banco="banco_local.db"):
    """
    Conecta-se ao banco de dados SQLite e cria a tabela 'documentos' se ela não existir.
    """
    conn = sqlite3.connect(nome_banco)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            texto TEXT,
            embedding BLOB
        )
    ''')
    conn.commit()
    return conn

# Funções de embedding e busca similares (mantidas do seu código, não alteradas nesta fase)
def gerar_embedding_simples(texto):
    np.random.seed(hash(texto) % (2**32 - 1))
    vetor = np.random.rand(512).astype(np.float32)
    return vetor

def inserir_documento(conn, texto):
    embedding = gerar_embedding_simples(texto)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO documentos (texto, embedding) VALUES (?, ?)",
                   (texto, embedding.tobytes()))
    conn.commit()

def buscar_similares(conn, texto_consulta, top_k=3):
    embedding_consulta = gerar_embedding_simples(texto_consulta)
    cursor = conn.cursor()
    cursor.execute("SELECT id, texto, embedding FROM documentos")
    resultados = cursor.fetchall()

    textos_com_id = []
    similaridades = []

    for id_, texto, emb_bytes in resultados:
        emb = np.frombuffer(emb_bytes, dtype=np.float32)
        sim = cosine_similarity([embedding_consulta], [emb])[0][0]
        textos_com_id.append((id_, texto))
        similaridades.append(sim)

    combinados = sorted(zip(textos_com_id, similaridades), key=lambda x: x[1], reverse=True)
    return combinados[:top_k]

# ===========================
# CONFIGURAÇÃO DOS PESOS DA FÓRMULA DE FORÇA DE INFLUÊNCIA
# (Agora será carregado do Firestore, mas mantém uma estrutura padrão)
# ===========================
# Este será o fallback se o Firestore não estiver disponível ou não tiver dados
DEFAULT_INFLUENCE_WEIGHTS = {
    "mapa_mental_niveis": {
        "nivel_0_principal": 1.0,
        "nivel_1_filhos": 0.7,
        "nivel_2_netos": 0.4,
        "nivel_3_bisnetos": 0.2
    },
    "seo_factores": {
        "relevancia_conteudo": 0.9,
        "qualidade_backlinks": 0.8,
        "velocidade_site": 0.6
    },
    "video_factores": {
        "engajamento": 0.8,
        "retencao_audiencia": 0.9,
        "densidade_palavra_chave": 0.5
    }
}
# Variável global para armazenar os pesos carregados do Firestore
CURRENT_INFLUENCE_WEIGHTS = DEFAULT_INFLUENCE_WEIGHTS.copy()


# ===========================
# FUNÇÃO PARA CHAMAR O LLM E EXTRAIR CONCEITOS PARA MAPA MENTAL
# ===========================
def gerar_mapa_mental_com_llm(texto_completo):
    """
    Chama o LLM (Gemini) para extrair os conceitos principais e sub-conceitos
    de um texto e formatá-los para o mapa mental, aplicando a "Fórmula de Força de Influência".
    """
    model = genai.GenerativeModel(GEMINI_MODEL)
    
    prompt_content = f"""
    Com base no seguinte texto, extraia o conceito principal, e para ele, extraia os 3 conceitos mais importantes e, para cada um desses 3, extraia 2 sub-conceitos relevantes.
    Para cada conceito (principal, sub-conceitos de nível 1 e sub-conceitos de nível 2), forneça um "node" (o nome do conceito) e um "relevance_score" (de 0.1 a 1.0, onde 1.0 é mais relevante).
    Sua resposta DEVE ser APENAS o objeto JSON. Não inclua texto introdutório, conclusivo, explicações ou qualquer formatação além do JSON puro.

    Exemplo de formato JSON (apenas a estrutura, sem os dados de exemplo):
    {{
      "node": "Conceito Principal Extraído",
      "relevance_score": 0.9,
      "children": [
        {{
          "node": "Conceito Chave 1 Extraído",
          "relevance_score": 0.7,
          "children": [
            {{"node": "Sub-conceito 1.1 Extraído", "relevance_score": 0.6}},
            {{"node": "Sub-conceito 1.2 Extraído", "relevance_score": 0.5}}
          ]
        }},
        {{
          "node": "Conceito Chave 2 Extraído",
          "relevance_score": 0.75,
          "children": [
            {{"node": "Sub-conceito 2.1 Extraído", "relevance_score": 0.65}},
            {{"node": "Sub-conceito 2.2 Extraído", "relevance_score": 0.55}}
          ]
        }},
        {{
          "node": "Conceito Chave 3 Extraído",
          "relevance_score": 0.8,
          "children": [
            {{"node": "Sub-conceito 3.1 Extraído", "relevance_score": 0.7}},
            {{"node": "Sub-conceito 3.2 Extraído", "relevance_score": 0.6}}
          ]
        }}
      ]
    }}

    Texto:
    {texto_completo}
    """
    
    llm_response_text = ""

    try:
        response = model.generate_content(prompt_content)
        
        if response.candidates:
            if response.candidates[0].content.parts:
                llm_response_text = response.candidates[0].content.parts[0].text
            else:
                raise ValueError("LLM response has no content parts.")
        else:
            raise ValueError("LLM response has no candidates.")

        json_match = re.search(r'```json\s*(.*?)\s*```', llm_response_text, re.DOTALL)
        if json_match:
            json_string = json_match.group(1)
        else:
            json_string = llm_response_text.strip()
        
        llm_data = json.loads(json_string)

        def calculate_influence(node_data, level=0):
            # Obtém os pesos da configuração global ATUAL
            weights_config = CURRENT_INFLUENCE_WEIGHTS["mapa_mental_niveis"]
            
            weight_key_map = {
                0: "nivel_0_principal",
                1: "nivel_1_filhos",
                2: "nivel_2_netos",
                3: "nivel_3_bisnetos"
            }
            weight_key = weight_key_map.get(level, "nivel_3_bisnetos")
            
            Wn = weights_config.get(weight_key, 0.1) 
            Pn = node_data.get("relevance_score", 0.1)
            
            influence_score = round(float(Pn) * Wn, 2)
            influence_score = max(0.05, min(1.0, influence_score))
            
            node_data["influence_score"] = influence_score
            
            if "children" in node_data and node_data["children"]:
                node_data["children"] = [calculate_influence(child, level + 1) for child in node_data["children"]]
            
            return node_data

        final_mind_map_data = calculate_influence(llm_data)
        return final_mind_map_data

    except json.JSONDecodeError as jde:
        print(f"Erro de JSON Decode: {jde}. Resposta bruta do LLM: '{llm_response_text}'")
        return {"error": f"Erro ao processar JSON do LLM. Resposta bruta: '{llm_response_text[:200]}'..."}
    except ValueError as ve:
        print(f"Erro de Valor (candidatos/partes ausentes): {ve}")
        return {"error": f"LLM não retornou conteúdo válido: {ve}"}
    except Exception as e:
        print(f"Erro geral ao chamar LLM ou parsear resposta: {e}")
        return {"error": f"Erro interno ao gerar mapa: {e}"}

# ===========================
# Rotas da API
# ===========================

@app.route('/api/analisar-seo', methods=['POST'])
def analisar_seo_data():
    data = request.get_json()
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Conteúdo de texto não fornecido."}), 400

    conn = conectar_banco()
    inserir_documento(conn, content)
    similares = buscar_similares(conn, content, top_k=5)

    labels_pie = [f"Doc ID {t[0]}" for (t, s) in similares]
    data_pie = [float(round(s * 100, 1)) for (t, s) in similares]

    if not labels_pie:
        labels_pie = ['Nenhuma Palavra-Chave', 'Dados Genéricos']
        data_pie = [50, 50]

    keyword_distribution = {
        "labels": labels_pie,
        "datasets": [
            {
                "data": data_pie,
                "backgroundColor": [
                    'rgba(136, 192, 208, 0.8)',
                    'rgba(163, 190, 140, 0.8)',
                    'rgba(180, 142, 173, 0.8)',
                    'rgba(235, 203, 139, 0.8)',
                    'rgba(191, 97, 106, 0.8)',
                ],
                "borderColor": [
                    'rgba(136, 192, 208, 1)',
                    'rgba(163, 190, 140, 1)',
                    'rgba(180, 142, 173, 1)',
                    'rgba(235, 203, 139, 1)',
                    'rgba(191, 97, 106, 1)',
                ],
                "borderWidth": 1,
            },
        ],
    }

    key_metrics = [
        {"label": "Total de Palavras", "value": str(len(content.split()))},
        {"label": "Documentos Similares Encontrados", "value": str(len(similares))},
        {"label": "Primeiro Doc. Similar", "value": f"ID {similares[0][0][0]} ({float(similares[0][1]):.2f})" if similares else "N/A"},
        {"label": "Qualidade do Texto", "value": "Excelente (Simulado)"},
    ]

    conn.close()

    return jsonify({
        "keywordDistribution": keyword_distribution,
        "keyMetrics": key_metrics
    })

# ===========================
# Rotas da API para o Núcleo de Consciência (AGORA COM FIRESTORE)
# ===========================
@app.route('/api/salvar-logica', methods=['POST'])
def salvar_logica():
    """
    Endpoint para salvar "linhas de lógica" (pesos/modelos) do Núcleo de Consciência no Firestore.
    """
    global CURRENT_INFLUENCE_WEIGHTS # Permite modificar a variável global

    data = request.get_json()
    logica_a_salvar = data.get('logica', {})
    
    if not db_firestore:
        return jsonify({"status": "erro", "mensagem": "Firestore não inicializado."}), 500

    try:
        # Salva no Firestore na coleção 'configs' com o documento 'influence_weights'
        # Usamos set com merge=True para atualizar campos existentes e adicionar novos
        doc_ref = db_firestore.collection('configs').document('influence_weights')
        doc_ref.set(logica_a_salvar, merge=True)
        
        # Atualiza a variável global com os pesos recém-salvos para uso imediato
        # Isso garante que a próxima chamada que usar CURRENT_INFLUENCE_WEIGHTS
        # já use os dados atualizados.
        CURRENT_INFLUENCE_WEIGHTS.update(logica_a_salvar) 

        print(f"Lógica/pesos salvos no Firestore: {json.dumps(logica_a_salvar, indent=2)}")
        return jsonify({"status": "sucesso", "mensagem": "Lógica/pesos salvos no Firestore."})
    except Exception as e:
        print(f"Erro ao salvar lógica/pesos no Firestore: {e}")
        return jsonify({"status": "erro", "mensagem": f"Erro ao salvar lógica/pesos: {e}"}), 500


@app.route('/api/carregar-logica', methods=['GET'])
def carregar_logica():
    """
    Endpoint para carregar "linhas de lógica" (pesos/modelos) para o Núcleo de Consciência do Firestore.
    """
    global CURRENT_INFLUENCE_WEIGHTS # Permite modificar a variável global

    if not db_firestore:
        return jsonify({"status": "erro", "mensagem": "Firestore não inicializado."}), 500

    try:
        doc_ref = db_firestore.collection('configs').document('influence_weights')
        doc = doc_ref.get()

        if doc.exists:
            # Atualiza a variável global com os pesos carregados do Firestore
            # Caso o documento exista, ele substituirá os pesos padrão
            CURRENT_INFLUENCE_WEIGHTS = doc.to_dict()
            print(f"Lógica/pesos carregados do Firestore: {json.dumps(CURRENT_INFLUENCE_WEIGHTS, indent=2)}")
            return jsonify({"status": "sucesso", "logica": CURRENT_INFLUENCE_WEIGHTS})
        else:
            print("Documento 'influence_weights' não encontrado no Firestore. Retornando pesos padrão.")
            return jsonify({"status": "sucesso", "logica": DEFAULT_INFLUENCE_WEIGHTS})
    except Exception as e:
        print(f"Erro ao carregar lógica/pesos do Firestore: {e}")
        return jsonify({"status": "erro", "mensagem": f"Erro ao carregar lógica/pesos: {e}"}), 500


@app.route('/api/gerar-mapa-mental', methods=['POST'])
def gerar_mapa_mental():
    data = request.get_json()
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "Conteúdo de texto para mapa mental não fornecido."}), 400

    mind_map_llm_data = gerar_mapa_mental_com_llm(content)
    
    if "error" in mind_map_llm_data:
        print(f"Erro recebido de gerar_mapa_mental_com_llm: {mind_map_llm_data.get('error')}")
        return jsonify(mind_map_llm_data), 500

    return jsonify(mind_map_llm_data)

@app.route('/api/analisar-video', methods=['POST'])
def analisar_video():
    data = request.get_json()
    video_url = data.get('videoUrl', '')
    transcription = data.get('transcription', '')

    if not video_url and not transcription:
        return jsonify({"error": "URL do vídeo ou transcrição não fornecida para análise."}), 400

    simulated_video_analysis = {
        "title": "Título do Vídeo (Simulado)",
        "duration": "5:30",
        "keyHighlights": [
            "Ponto Principal 1",
            "Ponto Principal 2 (based on transcription)",
            "Ponto Principal 3"
        ],
        "sentiment": "Positivo (Simulado)",
        "keywords": ["vídeo", "análise", "simulação"]
    }
    if video_url:
        simulated_video_analysis["title"] = f"Análise de Vídeo: {video_url[:30]}..."
    elif transcription:
        simulated_video_analysis["keyHighlights"].append(f"Início da Transcrição: {transcription[:50]}...")

    return jsonify(simulated_video_analysis)

# ===========================
# PONTO DE ENTRADA DO SERVIDOR FLASK
# ===========================
if __name__ == '__main__':
    conn_init = conectar_banco()
    cursor_init = conn_init.cursor()
    cursor_init.execute("SELECT COUNT(*) FROM documentos")
    if cursor_init.fetchone()[0] == 0:
        print("Inserindo documentos de teste no banco de dados...")
        inserir_documento(conn_init, "O marketing digital é essencial para empresas hoje em dia.")
        inserir_documento(conn_init, "SEO on-page otimiza o conteúdo de uma página para motores de busca.")
        inserir_documento(conn_init, "Mapas mentais são ferramentas visuais para organizar ideias.")
        inserir_documento(conn_init, "Gerenciamento de vídeos e sua otimização para plataformas.")
        inserir_documento(conn_init, "Inteligência artificial e aprendizado de máquina estão revolucionando a análise de dados.")
        print("Documentos de teste inseridos.")
    else:
        print("Banco de dados já contém documentos. Não inserindo novos testes.")
    conn_init.close()

    # Tenta carregar os pesos do Firestore na inicialização do servidor
    # Isso garante que o servidor Flask comece com a última "lógica" salva.
    if db_firestore:
        try:
            doc_ref = db_firestore.collection('configs').document('influence_weights')
            doc = doc_ref.get()
            if doc.exists:
                # REMOVIDO: `global CURRENT_INFLUENCE_WEIGHTS` não é necessário aqui,
                # pois estamos no escopo global e estamos apenas atribuindo
                # à variável global que já foi declarada no topo do script.
                CURRENT_INFLUENCE_WEIGHTS = doc.to_dict() 
                print("Pesos de influência carregados do Firestore na inicialização.")
            else:
                # Se não houver pesos salvos, salve os pesos padrão para inicializar o documento
                db_firestore.collection('configs').document('influence_weights').set(DEFAULT_INFLUENCE_WEIGHTS)
                print("Documento de pesos de influência criado com valores padrão no Firestore.")
        except Exception as e:
            print(f"Erro ao carregar/salvar pesos na inicialização do Firestore: {e}")


    app.run(host='0.0.0.0', port=5000, debug=True)
