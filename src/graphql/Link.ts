import { extendType, intArg, list, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name:'Link',
    definition(t) {
        t.nonNull.int('id'),
        t.nonNull.string('description'),
        t.nonNull.string('url')
    },
})

let links: NexusGenObjects['Link'][]= [
    {
        id:1,
        url:'www.org',
        description:'Fullstack tutorial in graphql'
    },
    {
        id:2,
        url:'www.com',
        description:'Backend tutorial in graphql'
    },
]


export const LinkQuery = extendType({
    type:'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed',{
            type:'Link',
            resolve(parent,args,context, info){
                return links
            }
        })
        t.nonNull.list.nonNull.field('link', {
            type:'Link',
            args:{
                id: nonNull(intArg())
            },
            resolve(parent,args,context){
                const {id} = args
                const link = links.find((l)=> l.id == id)
                return link ? [link] : []
            }
        } )
    },
})

export const LinkMutation = extendType({
    type:'Mutation',
    definition(t) {
        t.nonNull.field('post',{
            type:'Link',
            args:{
                description: nonNull(stringArg()),
                url: nonNull(stringArg())
            },
            resolve(parent,args,context){
                const {description,url} = args
                let idCount = links.length + 1
                const link = {
                    id: idCount,
                    description: description,
                    url: url
                }
                links.push(link)
                return link
            }
        })
        t.nonNull.field('deleteLink',{
            type:'Boolean',
            args:{
                id: nonNull(intArg())
            },
            resolve(parent,args,context){
                const {id} = args
                const initialLinks = links.length
                links = links.filter((l)=> l.id != id)
                return links.length !== initialLinks
            }
        })
        t.nonNull.field('updateLink', {
            type:'Boolean',
            args:{
                id: nonNull(intArg()),
                description: nonNull(stringArg()),
                url: nonNull(stringArg())
            },
            resolve(parent,args,context){
                const {id,description,url} = args
                let linkIndex = links.findIndex((l)=> l.id == id)
                if(linkIndex == -1){
                    return false
                }
                links[linkIndex] = {...links[linkIndex], description:description , url:url}
                return  true 
            }
        })
    },

})

