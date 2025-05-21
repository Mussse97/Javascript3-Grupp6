// Exporterar ett användarschema för Sanity CMS som definierar strukturen för användardata som ska lagras i Sanity CMS
export default {
    name: 'user',
    type: 'document',
    title: 'Användare', 
    fields: [
        { name: 'username', 
          type: 'string', 
          title: 'Användarnamn', 
          validation: R => R.required() 
        },
        { name: 'email', 
          type: 'string', 
          title: 'E-post', 
          validation: R => R.required().email() 
        }, 
        { name: 'bio', 
          type: 'text', 
          title: 'Om mig' 
        },
        { name: 'profilePicture', 
          type: 'image', 
          title: 'Profilbild' 
        },
        { name: 'createdAt', 
          type: 'datetime', initialValue: () => new Date().toISOString() 
        } 
    ]
}