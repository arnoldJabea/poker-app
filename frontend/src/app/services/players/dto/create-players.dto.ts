export interface CreatePlayerDto {
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  pays: string;
  date_naissance: Date;
}
