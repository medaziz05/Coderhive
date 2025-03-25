import { Content } from './content';
import { Quiz } from './quiz';

export interface Module {
  id?: number;
  title: string;
  description: string;
  content?: string; // ✅ Champ pour stocker du texte long
  pdfFilePath?: string; // ✅ Champ pour stocker l'URL du fichier PDF
  trainingProgram: { id: number }; // ✅ Correspond à l'ID du programme de formation
  contents?: Content[]; // ✅ Liste des contenus liés au module
  quiz?: Quiz; // ✅ Un quiz optionnel associé au module
}
