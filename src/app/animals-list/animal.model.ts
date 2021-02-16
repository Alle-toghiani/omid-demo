export interface animalModel {
  id?: number,
  name?: string,
  breed: string,
  gender: string,
  birthDate?:Date,
  description?: string,
  imageAddress?: string,
  vaccination?: boolean,
  dateAdded?: Date
}
