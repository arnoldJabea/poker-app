export interface Player {
  id: number;
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  pays: string;
  date_naissance: Date;
  money: number;
  isAI: boolean;
}
