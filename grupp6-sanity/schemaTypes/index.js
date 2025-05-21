// Importerar alla schematyper som vi har skapat 
import category from "./category"
import genre from "./genre"
import post from "./post"
import user from "./user"


// Exporterar alla schematyper så att de kan användas i Sanity CMS 
export const schemaTypes = [category, genre, post, user]
