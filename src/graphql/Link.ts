import { extendType, intArg, list, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { context } from "../context";

export const Link = objectType({
    name:'Link',
    definition(t) {
        t.nonNull.int('id'),
        t.nonNull.string('description'),
        t.nonNull.string('url')
    },
})




export const LinkQuery = extendType({
    type:'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed',{
            type:'Link',
            resolve(parent,args,context, info){
                return context.prisma.link.findMany()
            }
        })
        t.nonNull.list.nonNull.field('link', {
            type:'Link',
            args:{
                id: nonNull(intArg())
            },
            resolve: async(parent,args,context)=>{
                const {id} = args
                const link =await context.prisma.link.findUnique({
                    where:{
                        id:id
                    }
                })
                return link ? [link] : []
            }
        })
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
                const newLink = context.prisma.link.create({
                    data:{
                        description:description,
                        url:url
                    }
                })
                return newLink
            }
        })
        t.nonNull.field('deleteLink',{
            type:'Boolean',
            args:{
                id: nonNull(intArg())
            },
            resolve: async(parent,args,context)=>{
                const {id} = args
                const deleted = await context.prisma.link.delete({
                    where:{
                        id:id
                    }
                })
                return true
            }
        })
        t.nonNull.field('updateLink', {
            type:'Boolean',
            args:{
                id: nonNull(intArg()),
                description: nonNull(stringArg()),
                url: nonNull(stringArg())
            },
            resolve: async(parent,args,context)=>{
                const {id,description,url} = args
                let linkFound = await context.prisma.link.findFirst({
                    where:{
                        id:id
                    }
                })
                if(!linkFound){
                    return false
                }
                await context.prisma.link.update({
                    where:{
                        id:id
                    },
                    data:{
                        description:description,
                        url:url
                    }
                })
                return  true 
            }
        })
    },

})

