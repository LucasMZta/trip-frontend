import { AtSign, User, X } from "lucide-react"
import { Modal } from "../../components/modal"
import { Button } from "../../components/button"
import { api } from "../../lib/axios"
import { useNavigate, useParams } from "react-router-dom"
import { FormEvent, useEffect, useState } from "react"
import { Trip } from "../../types/trip"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Participant {
   id: string,
   name: string,
   email: string,
   is_confirmed: boolean,
   trip_id: string
}

export const TripConfirmParticipant = () => {
   const { participantId } = useParams();
   const navigate = useNavigate();

   const [participant, setParticipant] = useState<Participant | undefined>();
   const [trip, setTrip] = useState<Trip | undefined>();

   useEffect(() => {

      const loadParticipantData = async () => {
         const res = await api.get(`/participants/${participantId}`);
         setParticipant(res.data.participant);

         const tripData = await api.get(`/trips/${res.data.participant.trip_id}`)
         setTrip(tripData.data.trip);

         if (res.data.participant.is_confirmed) {
            navigate(`/trips/${tripData.data.trip.id}`);
         }
      }
      loadParticipantData();
   }, [participantId])

   const displayedDate = trip
      ? `${format(trip.starts_at, "d' de 'LLLL", { locale: ptBR })} a ${format(trip.ends_at, "d' de 'LLLL", { locale: ptBR })} de ${format(trip.ends_at, 'y', { locale: ptBR })},`
      : null


   const confirmParticipant = async (e: FormEvent<HTMLFormElement>) => {
      const data = new FormData(e.currentTarget);

      const name = data.get('name')?.toString();

      await api.post(`/participants/${participantId}/confirm`, {
         name: name
      });
   }
   return (
      <>
         {participant &&
            !participant.is_confirmed ?
            <Modal>
               <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                  <div className='space-y-2'>
                     <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Confirmar presença</h2>
                        <button type="button" ><X className='size-5 text-zinc-400' /> </button>
                     </div>
                     <p className='text-sm text-zinc-400'>
                        Para concluir a criação da viagem para <span className='text-zinc-100 font-semibold'> {trip?.destination} </span> nas datas de <span className='text-zinc-100 font-semibold'> {displayedDate} </span> preencha seus dados abaixo:
                     </p>
                  </div>
                  <form onSubmit={confirmParticipant} className='space-y-3'>
                     <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                        <User className='text-zinc-400 size-5' />
                        <input
                           type="text"
                           name='name'
                           placeholder="Seu nome completo"
                           // onChange={(e) => setOwnerName(e.target.value)}
                           required
                           className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
                     </div>
                     {/* {errorConfirmTripName &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorConfirmTripName}</div>
               } */}
                     <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                        <AtSign className='text-zinc-400 size-5' />
                        <input
                           type="email"
                           name='email'
                           required
                           disabled
                           placeholder="Seu e-mail pessoal"
                           value={participant?.email}
                           // onChange={(e) => setOwnerEmail(e.target.value)}
                           className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
                     </div>
                     {/* {errorConfirmTripEmail &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorConfirmTripEmail}</div>
               } */}
                     <Button type="submit" variantColor="primary" size="full" >
                        Confirmar criação da viagem
                     </Button>
                  </form>

               </div>
            </Modal>
            : ''
         }

      </>

   )
}