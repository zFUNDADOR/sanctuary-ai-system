#!/bin/bash

# Inicia o Flask em background
python3 main.py &

# Inicia o Vite (React) frontend
npm run dev