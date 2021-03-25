export interface animalModel {
  id?: string,
  name?: string,
  breed: string,
  gender: string,
  birthDate?:Date,
  description?: string,
  imageAddress?: string,
  vaccination?: boolean,
  dateAdded?: Date
}
