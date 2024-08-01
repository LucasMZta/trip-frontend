import { AtSign, CheckCircle2, CircleDashed, Plus, UserCog, X } from "lucide-react"
import { Button } from "../../components/button"
import { useParams } from "react-router-dom"
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { Modal } from "../../components/modal";
import { z } from "zod";
import { ErrorItem, getErrorFromZod } from "../../utils/getErrorFromZod";
import { AxiosError } from "axios";

interface Participant {
   id: string;
   name: string | null;
   email: string;
   is_confirmed: boolean;
   is_owner: boolean;
}

export const Guests = () => {

   const { tripId } = useParams();
   const [tripParticipants, setTripParticipants] = useState<Participant[]>([]);
   const [isCreateGuestModal, setIsCreateGuestModal] = useState(false);
   const [errors, setErrors] = useState<ErrorItem[]>([]);
   const [alertHasInvited, setAlertHasInvited] = useState(false);
   const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

   const [postError, setPostError] = useState(false);

   const errorInvite = errors.find(item => item.field === 'emailsToInvite')?.message

   useEffect(() => {
      api.get(`/trips/${tripId}/participants`).then(response => setTripParticipants(response.data.participants))
   }, [tripId])

   const emailSchema = z.object({
      emailsToInvite: z.string().email('Formato de email inválido.')
   })

   const openGuestModal = () => {
      setIsCreateGuestModal(true);
   }
   const closeGuestModal = async () => {
      setIsCreateGuestModal(false);
      setAlertHasInvited(false);
      setErrors([]);

      if (emailsToInvite.length > 0) {
         console.log('Emails: ', emailsToInvite);
         emailsToInvite.map(async (email) => {
            try {
               await api.post(`/trips/${tripId}/invites`, {
                  email: email
               })
               window.location.reload();
            } catch (error) {
               console.log(error);
               setPostError(true)
            }
         })
         if (!postError) {
            setPostError(false)
         }
      }

   }
   const removeEmailFromInvite = (email: string) => {
      if (emailsToInvite) {
         const newEmailList = emailsToInvite.filter(invited => invited !== email);
         setEmailsToInvite(newEmailList);
      }
   }
   const removeParticipant = async (participantId: string) => {

      try {
         await api.delete(`/participants/${participantId}/remove`)
         window.location.reload();
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error.response?.data.message)
            if (error.response?.data.message) {
               setErrors([{ field: 'emailsToInvite', message: error.response.data.message }])
            }
         }
      }
   }

   const addNewEmailToInvite = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors([]);
      setAlertHasInvited(false);

      const data = new FormData(e.currentTarget);
      const email = data.get('email')?.toString();

      const schema = emailSchema.safeParse({
         emailsToInvite: email
      })

      if (!schema.success) return setErrors(getErrorFromZod(schema.error));

      if (!email) { return }

      if (!emailsToInvite) return

      if (emailsToInvite.includes(schema.data.emailsToInvite) || tripParticipants.filter((participant) => participant.email === schema.data.emailsToInvite).length > 0) {
         setAlertHasInvited(true);
         return
      }

      setEmailsToInvite([...emailsToInvite, email]);
      setErrors([]);

      e.currentTarget.reset();
   }

   return (
      <div className="space-y-6">
         <h2 className="text-xl font-semibold">Convidados</h2>
         {tripParticipants.map((participant, index) => (
            <div key={participant.id} className="space-y-5">
               <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                     <span className="block font-medium text-zinc-100">
                        {participant.name
                           ? participant.is_owner ? `${participant.name} (Você)` : `${participant.name}`
                           : `Convidado ${index}`
                        }
                     </span>
                     <span className="block font-sm text-zinc-400 truncate">{participant.email}</span>
                  </div>
                  {participant.is_confirmed ? <CheckCircle2 className="text-green-400 size-5 flex-shrink-0" /> : <CircleDashed className="text-zinc-400 size-5 flex-shrink-0" />}
               </div>
            </div>
         ))}


         <Button variantColor="secondary" size="full" onClick={openGuestModal} >
            <UserCog className='size-5' />
            Gerenciar Convidados
         </Button>

         {isCreateGuestModal &&
            <Modal>
               <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                  <div className='space-y-2'>
                     <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Gerenciar Convidados</h2>
                        <button type="button" onClick={closeGuestModal}><X className='size-5 text-zinc-400' /> </button>
                     </div>
                     <p className='text-sm text-zinc-400'>Os convidados irão receber e-mails para confirmar a participação na viagem.</p>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                     {tripParticipants.length === 0 ?
                        <p className='text-center text-zinc-600 py-2 w-full '>Voce ainda não selecionou nenhum convidado!</p>
                        :
                        tripParticipants.map((participant, key) => (
                           <div key={key} className='py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2'>
                              <span className='text-zinc-300'> {participant.email} </span>
                              <button type="button" onClick={() => removeParticipant(participant.id)} > <X className='size-4 text-zinc-400' /> </button>
                           </div>
                        ))
                     }
                     {emailsToInvite.length > 0 &&
                        emailsToInvite.map((newParticipant, key) => (
                           <div key={key} className='py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2'>
                              <span className='text-zinc-300'> {newParticipant} </span>
                              <button type="button" onClick={() => removeEmailFromInvite(newParticipant)} > <X className='size-4 text-zinc-400' /> </button>
                           </div>
                        ))
                     }
                  </div>

                  <div className='w-full h-px bg-zinc-800' />

                  <form onSubmit={addNewEmailToInvite} className='md:p-2.5 bg-transparent md:bg-zinc-950 border border-transparent md:border-zinc-800 rounded-lg flex items-center gap-2 flex-col md:flex-row'>
                     <div className='p-4 md:p-2 flex items-center flex-1 gap-2 bg-zinc-950 md:bg-transparent w-full md:w-auto rounded-lg border border-zinc-800 md:border-none'>
                        <AtSign className='text-zinc-400 size-5' />
                        <input
                           type="email"
                           name='email'
                           placeholder="Digite o e-mail do convidado"
                           className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
                     </div>
                     <Button type="submit" variantColor="primary" >
                        Convidar
                        <Plus className='size-5' />
                     </Button>
                  </form>

                  {errorInvite &&
                     <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorInvite}</div>
                  }
                  {alertHasInvited &&
                     <div className='bg-red-400/70 text-red-950 rounded-md p-2'>
                        Email já cadastrado!
                     </div>
                  }

               </div>
            </Modal>
         }

      </div>
   )
}