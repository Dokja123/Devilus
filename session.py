import uuid
import os

# Fonction pour générer ou récupérer l'ID de session
def get_session_id():
    # Chemin du fichier où l'ID de session sera stocké
    session_file = "session_id.txt"
    
    # Vérifie si le fichier existe déjà
    if os.path.exists(session_file):
        # Si le fichier existe, lit l'ID de session depuis ce fichier
        with open(session_file, 'r') as file:
            session_id = file.read().strip()
    else:
        # Si le fichier n'existe pas, génère un nouvel ID de session unique
        session_id = str(uuid.uuid4())
        
        # Sauvegarde le nouvel ID de session dans le fichier
        with open(session_file, 'w') as file:
            file.write(session_id)
    
    return session_id

# Exemple d'utilisation
if __name__ == "__main__":
    session_id = get_session_id()
    print(f"L'ID de session est : {session_id}")