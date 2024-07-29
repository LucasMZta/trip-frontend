import { Link2, Tag, X } from "lucide-react"
import { Modal } from "../../components/modal"
import { Button } from "../../components/button"
import { FormEvent, useState } from "react"
import { api } from "../../lib/axios"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"

type Props = {
   closeModalCreateLink: () => void
}

export const CreateLinkModal = ({ closeModalCreateLink }: Props) => {
   const { tripId } = useParams();
   const [errorUrlFormat, setErrorUrlFormat] = useState('');
   const [errorUrlTitle, setErrorUrlTitle] = useState('');

   const createLink = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorUrlFormat('');

      const data = new FormData(e.currentTarget);

      const title = data.get('title')?.toString();
      const url = data.get('url')?.toString();

      try {
         await api.post(`/trips/${tripId}/links`, {
            title,
            url
         });
         window.location.reload();
      } catch (error) {
         if (error instanceof AxiosError) {
            if (error.response) {
               if (error.response.data.errors.title) setErrorUrlTitle(error.response.data.errors.title)

               if (error.response.data.errors.url) setErrorUrlFormat(error.response.data.errors.url)

            }
         }
      }

   }

   return (
      <Modal>
         <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 '>
            <div className='space-y-2'>
               <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Cadastrar Link</h2>
                  <button type="button" onClick={closeModalCreateLink}><X className='size-5 text-zinc-400' /> </button>
               </div>
               <p className='text-sm text-zinc-400'>
                  Todos convidados podem visualizar os links importantes.
               </p>
            </div>
            <form onSubmit={createLink} className='space-y-3'>
               <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                  <Tag className='text-zinc-400 size-5' />
                  <input
                     type="text"
                     name='title'
                     required
                     placeholder="Titulo do link"
                     className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
               </div>
               {errorUrlTitle &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorUrlTitle}</div>
               }
               <div className="flex items-center gap-2">
                  <div className='h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                     <Link2 className='text-zinc-400 size-5' />
                     <input
                        type="text"
                        name='url'
                        required
                        placeholder="URL"
                        className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1 " />
                  </div>

               </div>
               {errorUrlFormat &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorUrlFormat}</div>
               }
               <Button type="submit" variantColor="primary" size="full" >
                  Salvar Link
               </Button>
            </form>
         </div>
      </Modal>
   )
}