#!/bin/bash

cd server || { echo "Dossier 'server' introuvable"; exit 1; }
echo "Lancement de 'npm run dev' dans le dossier 'server'..."
npm run dev & # Le '&' permet d'exécuter en arrière-plan
server_pid=$! # Sauvegarde du PID du processus

cd ..

cd client || { echo "Dossier 'client' introuvable"; exit 1; }
echo "Lancement de 'npm run dev' dans le dossier 'client'..."
npm run dev & # Le '&' permet d'exécuter en arrière-plan
client_pid=$! # Sauvegarde du PID du processus

wait $server_pid $client_pid

echo "Les deux processus sont terminés."

