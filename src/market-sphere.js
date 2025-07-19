import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * market-sphere.js - 3D interactive visualization of market sectors and micro-niches
 * Parte da Plataforma de Pesquisa de IA Multi-Agente
 */

// Constantes de cor para clareza visual
const SECTOR_COLORS = {
    RED: new THREE.Color(0xe74c3c),    // Nenhum vetor ativo
    GREEN: new THREE.Color(0x2ecc71),  // Pelo menos 1 vetor ativo
    BLUE: new THREE.Color(0x3498db),   // Mais de 50% ativo
    PURPLE: new THREE.Color(0x9b59b6)  // Todos os vetores ativos
};

const VECTOR_COLORS = {
    ACTIVE: new THREE.Color(0x2ecc71),   // Micro-nicho ativo
    INACTIVE: new THREE.Color(0xe74c3c)  // Micro-nicho inativo
};

// Variáveis de nível de cena
let scene, camera, renderer, controls;
let sectorSphereGroup, microNicheVectorsGroup;
let raycaster, mouse;
let currentData = null; // Será definido por updateMarketData

let sectorTooltip, vectorTooltip, backButton;
let isInitialized = false;

// Variável para controlar o objeto que estava intersecionado no frame anterior
let previousIntersectedObject = null;

/**
 * Calcula a cor para um setor com base na porcentagem de micro-nichos ativos.
 * @param {Array} microNiches - A lista de micro-nichos para o setor.
 * @returns {THREE.Color} A cor calculada para o setor.
 */
function getSectorColor(microNiches) {
    if (!microNiches || microNiches.length === 0) {
        return SECTOR_COLORS.RED;
    }
    const total = microNiches.length;
    const activeCount = microNiches.filter(mn => mn.status === 'ativo').length;
    
    if (activeCount === 0) return SECTOR_COLORS.RED;

    /* @tweakable Limiar para um setor ser considerado altamente ativo e colorido de azul. */
    const HIGHLY_ACTIVE_THRESHOLD = 0.5;

    const activePercentage = activeCount / total;

    if (activePercentage === 1) return SECTOR_COLORS.PURPLE;
    if (activePercentage > HIGHLY_ACTIVE_THRESHOLD) return SECTOR_COLORS.BLUE;
    return SECTOR_COLORS.GREEN;
}

/**
 * Inicializa a cena Three.js, câmera, renderizador e controles.
 * @param {string} containerId - O ID do elemento DOM para o canvas 3D.
 * @param {object} initialData - Os dados iniciais para renderizar.
 */
export function initMarketSphere(containerId, initialData) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contêiner com ID #${containerId} não encontrado.`);
        return;
    }

    // Verifica se já existe um canvas Three.js no contêiner
    const existingCanvas = container.querySelector('canvas');
    if (isInitialized && existingCanvas) {
        console.log('initMarketSphere: Esfera do Mercado já inicializada. Pulando inicialização completa.');
        // Se já inicializado e o canvas existe, apenas atualiza os dados se houver novos
        if (initialData && initialData !== currentData) {
            console.log('initMarketSphere: Dados iniciais diferentes, chamando updateMarketData.');
            updateMarketData(initialData); // Apenas atualiza os dados, não reinicializa a cena
        }
        return;
    }

    // Se houver um canvas existente mas não inicializado (ex: após uma remoção manual), remove-o
    if (existingCanvas) {
        container.removeChild(existingCanvas);
        console.log('initMarketSphere: Canvas Three.js existente removido para reinicialização.');
    }
    
    // Configuração da Cena
    scene = new THREE.Scene();
    scene.background = document.body.classList.contains('dark-mode') 
        ? new THREE.Color(0x1e1e1e) 
        : new THREE.Color(0xf0f0f0);

    // Configuração da Câmera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3.5;

    // Configuração do Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    console.log('initMarketSphere: Elemento DOM do Renderizador anexado:', renderer.domElement); // LOG

    // Adiciona estilos inline para garantir que o canvas ocupe todo o espaço
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1'; // Garante que o canvas esteja acima de outros elementos HTML que não sejam tooltips

    // Controles de Órbita
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    
    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Grupos de Objetos
    sectorSphereGroup = new THREE.Group();
    scene.add(sectorSphereGroup);

    microNicheVectorsGroup = new THREE.Group();
    microNicheVectorsGroup.visible = false;
    scene.add(microNicheVectorsGroup);

    // Raycaster para interação com o mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Elementos da UI HTML (agora devem ser encontrados, pois não são removidos)
    sectorTooltip = document.getElementById('market-sphere-tooltip');
    vectorTooltip = document.getElementById('vector-tooltip');
    backButton = document.getElementById('back-to-sectors-btn');

    // LOGS para verificar se os elementos foram encontrados
    console.log('initMarketSphere: Elemento sectorTooltip:', sectorTooltip);
    console.log('initMarketSphere: Elemento vectorTooltip:', vectorTooltip);
    console.log('initMarketSphere: Elemento backButton:', backButton);
    
    // Ajusta o z-index dos tooltips para garantir que fiquem acima do canvas
    // Removemos os estilos de opacidade e pointer-events daqui, pois o CSS externo deve controlá-los
    if (sectorTooltip) {
        sectorTooltip.style.zIndex = '10';
        sectorTooltip.style.position = 'absolute'; 
        sectorTooltip.style.display = 'none'; // Garante que comece escondido
    }
    if (vectorTooltip) {
        vectorTooltip.style.zIndex = '10';
        vectorTooltip.style.position = 'absolute'; 
        vectorTooltip.style.display = 'none'; // Garante que comece escondido
    }


    // Listeners de Evento - Anexados ao canvas do Three.js
    // Isso é crucial para que o raycaster funcione corretamente no espaço 3D
    renderer.domElement.addEventListener('mousemove', onMouseMove, false); 
    renderer.domElement.addEventListener('click', onMouseClick, false);
    // NOVO: Adiciona listener para quando o mouse sai do canvas
    renderer.domElement.addEventListener('mouseleave', onMouseLeaveCanvas, false);
    
    if (backButton) { 
        backButton.addEventListener('click', showMainSphereVisualization);
    }
    window.addEventListener('resize', () => onWindowResize(container), false);

    // Carrega dados iniciais e inicia a animação
    updateMarketData(initialData);
    animate();
    isInitialized = true;
    console.log('initMarketSphere: Esfera do Mercado inicializada.');
}

/**
 * Loop principal da animação.
 */
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

/**
 * Lida com eventos de redimensionamento da janela.
 */
function onWindowResize(container) {
    if (!renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Lida com o evento de saída do mouse do canvas.
 */
function onMouseLeaveCanvas() {
    hideTooltip(sectorTooltip);
    hideTooltip(vectorTooltip);
    previousIntersectedObject = null; // Reseta o objeto intersecionado anterior
}

/**
 * Atualiza as coordenadas do mouse e verifica interseções para tooltips.
 */
function onMouseMove(event) {
    if (!renderer || !sectorTooltip || !vectorTooltip) return; 

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let currentIntersected = null; // Objeto que está sendo intersecionado AGORA

    // Verifica interseções no grupo visível
    let intersects = [];
    if (sectorSphereGroup.visible) {
        intersects = raycaster.intersectObjects(sectorSphereGroup.children);
    } else if (microNicheVectorsGroup.visible) {
        intersects = raycaster.intersectObjects(microNicheVectorsGroup.children);
    }

    if (intersects.length > 0) {
        currentIntersected = intersects[0].object; // Pega o primeiro objeto intersecionado
        
        if (currentIntersected.userData.sector) {
            showTooltip(sectorTooltip, event, `<b>${currentIntersected.userData.sector.name}</b><br>${currentIntersected.userData.sector.micro_niches.filter(m => m.status === 'ativo').length}/${currentIntersected.userData.sector.micro_niches.length} ativo(s)`);
            hideTooltip(vectorTooltip); // Garante que o tooltip de vetor esteja escondido
        } else if (currentIntersected.userData.microNiche) {
            showTooltip(vectorTooltip, event, `<b>${currentIntersected.userData.microNiche.name}</b><br>Sigla: ${currentIntersected.userData.microNiche.sigla}<br>Status: ${currentIntersected.userData.microNiche.status}`);
            hideTooltip(sectorTooltip); // Garante que o tooltip de setor esteja escondido
        }
    } else {
        // Se não houver interseções, esconde ambos os tooltips
        hideTooltip(sectorTooltip);
        hideTooltip(vectorTooltip);
    }

    // Lógica para esconder o tooltip quando o mouse sai de um objeto
    // e não entra em outro (ou entra no "vazio" do canvas).
    // Isso é crucial para transições suaves e para o espaço vazio dentro do canvas.
    if (previousIntersectedObject && previousIntersectedObject !== currentIntersected) {
        if (previousIntersectedObject.userData.sector) {
            hideTooltip(sectorTooltip);
        } else if (previousIntersectedObject.userData.microNiche) {
            hideTooltip(vectorTooltip);
        }
    }
    
    // Atualiza o objeto intersecionado anterior para o próximo frame
    previousIntersectedObject = currentIntersected; 
}

/**
 * Lida com cliques para selecionar setores.
 */
function onMouseClick(event) {
    if (sectorSphereGroup.visible) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sectorSphereGroup.children);
        // Garante que o clique só ative se for um setor real
        const clickedSectorMesh = intersects.find(i => i.object.userData.sector);
        if (clickedSectorMesh) {
            showVectorVisualization(clickedSectorMesh.object.userData.sector);
        }
    }
}

/**
 * Cria a visualização principal da esfera com setores.
 */
function createSectors() {
    // Limpa objetos anteriores
    // Percorre os filhos e remove/descarta
    while (sectorSphereGroup.children.length > 0) {
        const object = sectorSphereGroup.children[0];
        sectorSphereGroup.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
    }
    
    /* @tweakable Raio da esfera principal onde os setores são colocados. */
    const SPHERE_RADIUS = 2.0;

    const sectorCount = currentData.sectors.length;

    // Distribui os setores na superfície de uma esfera invisível usando espiral de Fibonacci
    currentData.sectors.forEach((sector, i) => {
        const color = getSectorColor(sector.micro_niches);
        const sectorMaterial = new THREE.MeshLambertMaterial({ color });
        const sectorGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.15);
        const sectorMesh = new THREE.Mesh(sectorGeometry, sectorMaterial);

        // Distribuição em espiral de Fibonacci para espalhamento uniforme
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const phi = Math.acos(1 - 2 * (i + 0.5) / sectorCount);
        const theta = 2 * Math.PI * (i + 0.5) / goldenRatio;
        sectorMesh.position.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);
        sectorMesh.lookAt(new THREE.Vector3(0, 0, 0));

        sectorMesh.userData = { sector };
        sectorSphereGroup.add(sectorMesh);
    });
    console.log('createSectors: Setores criados. Número de objetos no sectorSphereGroup:', sectorSphereGroup.children.length);
}

/**
 * Mostra a visualização detalhada do vetor para um setor selecionado.
 * @param {object} sectorData - Os dados para o setor selecionado.
 */
function showVectorVisualization(sectorData) {
    sectorSphereGroup.visible = false;
    microNicheVectorsGroup.visible = true;
    if (backButton) { 
        backButton.style.display = 'block';
    }
    // Garante que ambos os tooltips sejam escondidos ao mudar de vista
    hideTooltip(sectorTooltip); 
    hideTooltip(vectorTooltip); 
    previousIntersectedObject = null; // Reseta o objeto intersecionado anterior ao mudar de visualização

    // Limpa vetores anteriores
    // Garante que todos os objetos (meshes e linhas) sejam removidos
    while (microNicheVectorsGroup.children.length > 0) {
        const object = microNicheVectorsGroup.children[0];
        microNicheVectorsGroup.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
    }
    console.log('showVectorVisualization: microNicheVectorsGroup limpo. Número de objetos:', microNicheVectorsGroup.children.length);
    
    /* @tweakable Raio para a esfera de visualização de micro-nichos. */
    const VISUALIZATION_RADIUS = 1.5;

    sectorData.micro_niches.forEach((mn, i) => {
        const color = mn.status === 'ativo' ? VECTOR_COLORS.ACTIVE : VECTOR_COLORS.INACTIVE;
        const vectorMaterial = new THREE.MeshLambertMaterial({ color });
        const vectorGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const vectorMesh = new THREE.Mesh(vectorGeometry, vectorMaterial);

        // Distribui os vetores em torno de um ponto central usando espiral de Fibonacci
        const count = sectorData.micro_niches.length;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const phi = Math.acos(1 - 2 * (i + 0.5) / count);
        const theta = 2 * Math.PI * (i + 0.5) / goldenRatio;
        vectorMesh.position.setFromSphericalCoords(VISUALIZATION_RADIUS, phi, theta);
        
        vectorMesh.userData = { microNiche: mn };
        microNicheVectorsGroup.add(vectorMesh);

        // Linha conectando ao centro
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), vectorMesh.position]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        microNicheVectorsGroup.add(line);
    });
    console.log('showVectorVisualization: Vetores criados. Número de objetos no microNicheVectorsGroup:', microNicheVectorsGroup.children.length);

    // Anima a câmera para focar na nova visualização
    controls.target.set(0, 0, 0);
    camera.position.set(0, 0, 3.5);
    controls.update();
}

/**
 * Retorna à visualização principal da esfera de setores.
 */
function showMainSphereVisualization() {
    sectorSphereGroup.visible = true;
    microNicheVectorsGroup.visible = false;
    // Verifica se backButton não é null antes de acessar style
    if (backButton) { 
        backButton.style.display = 'none';
    }
    // Garante que ambos os tooltips sejam escondidos ao mudar de vista
    hideTooltip(sectorTooltip); 
    hideTooltip(vectorTooltip); 
    previousIntersectedObject = null; // Reseta o objeto intersecionado anterior ao mudar de visualização
    
    controls.target.set(0, 0, 0);
    camera.position.set(0, 0, 3.5);
    controls.update();
}

/**
 * Exibe um tooltip na posição do evento do mouse especificada.
 * @param {HTMLElement} tooltipEl - O elemento do tooltip.
 * @param {MouseEvent} event - O evento do mouse.
 * @param {string} content - O conteúdo HTML para o tooltip.
 */
function showTooltip(tooltipEl, event, content) {
    if (!renderer || !tooltipEl) return; 
    tooltipEl.innerHTML = content;
    const rect = renderer.domElement.getBoundingClientRect();
    // Ajusta a posição do tooltip para que ele siga o mouse
    tooltipEl.style.left = `${event.clientX - rect.left + 15}px`;
    tooltipEl.style.top = `${event.clientY - rect.top + 15}px`;
    tooltipEl.classList.add('active');
    tooltipEl.style.display = 'block'; // NOVO: Garante que o elemento esteja visível
}

/**
 * Oculta um tooltip.
 * @param {HTMLElement} tooltipEl - O elemento do tooltip.
 */
function hideTooltip(tooltipEl) {
    if (tooltipEl) { 
        tooltipEl.classList.remove('active');
        tooltipEl.style.display = 'none'; // NOVO: Esconde o elemento completamente
        console.log(`hideTooltip: Tooltip ${tooltipEl.id} escondido.`); 
    }
}

/**
 * Atualiza os dados do mercado e redesenha a visualização.
 * @param {object} newData - Os novos dados do mercado.
 */
export function updateMarketData(newData) {
    console.log('updateMarketData: Chamado com novos dados.');
    if (!newData || !newData.sectors) {
        console.error("updateMarketData: Dados inválidos fornecidos para updateMarketData.");
        return;
    }
    // Remove todos os objetos existentes dos grupos antes de adicionar os novos
    // Isso deve ajudar a evitar a duplicação de objetos
    while (sectorSphereGroup.children.length > 0) {
        const object = sectorSphereGroup.children[0];
        sectorSphereGroup.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
    }
    while (microNicheVectorsGroup.children.length > 0) {
        const object = microNicheVectorsGroup.children[0];
        microNicheVectorsGroup.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
    }

    currentData = newData;
    createSectors();
    showMainSphereVisualization();
    console.log("updateMarketData: Dados do mercado atualizados e esfera redesenhada.");
}
