import { Calendar, MapPin, Settings2, X } from "lucide-react"
import { Button } from "../../components/button"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { Modal } from "../../components/modal";
import { Trip } from "../../types/trip";
import { ShowError } from "../../components/show-error";
import { displayDateFormat } from "../../utils/displayFormatDate";

export const DestinationAndDateHeader = () => {

   const { tripId } = useParams();
   const [trip, setTrip] = useState<Trip | undefined>();

   const [isDestinationAndDateOpen, setIsDestinationAndDateOpen] = useState(false);

   useEffect(() => {
      api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
   }, [tripId]);

   const openDestinationAndDate = () => {
      setIsDestinationAndDateOpen(true);
   }
   const closeDestinationAndDate = () => {
      setIsDestinationAndDateOpen(false);
   }

   const displayedDate = trip?.starts_at && trip?.ends_at ? displayDateFormat({ from: new Date(trip?.starts_at), to: new Date(trip?.ends_at) }) : null;

   return (
      <>
         <div className="p-4 md:p-0 md:px-4 md:h-16 rounded-xl bg-zinc-900 shadow-shape flex md:items-center justify-between flex-col md:flex-row gap-2">
            <div className='flex items-center gap-2'>
               <MapPin className="size-5 text-zinc-400" />
               <span className="text-zinc-100">{trip?.destination} </span>
            </div>
            <div className="flex items-center justify-between md:gap-5">
               <div className='flex items-center md:gap-2 mr-2 md:mr-0'>
                  <Calendar className="size-5 text-zinc-400 mr-2 md:mr-0" />
                  <span className="text-zinc-100">{displayedDate}</span>
               </div>
               <div className='hidden md:block w-px h-6 bg-zinc-800' />
               <Button variantColor="secondary" onClick={openDestinationAndDate} >
                  <span className="hidden sm:inline-block">Alterar local/data</span>
                  <Settings2 className='size-5' />
               </Button>
            </div>

            {isDestinationAndDateOpen &&
               <Modal>
                  <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 '>
                     <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                           <h2 className='text-lg font-semibold'>Alterar Local/Data</h2>
                           <button type="button" onClick={closeDestinationAndDate}><X className='size-5 text-zinc-400' /> </button>
                        </div>
                        <p className='text-sm text-zinc-400'>
                           Convide seus amigos e planeje sua viagem!
                        </p>
                     </div>
                     <form className='space-y-3'>
                        <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                           <MapPin className='text-zinc-400 size-5' />
                           <input
                              type="text"
                              name='title'
                              placeholder="Para onde voce vai?"
                              className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
                        </div>
                        <div className="flex items-center gap-2">
                           <div className='h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                              <Calendar className='text-zinc-400 size-5' />
                              <input
                                 type="datetime-local"
                                 name='occurs_at'
                                 placeholder="Data e horário da Atividade"
                                 className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1 " />
                           </div>
                        </div>
                        <Button variantColor="primary" size="full" >
                           Salvar Atividade
                        </Button>
                     </form>
                  </div>
               </Modal>
            }
         </div>
         {trip?.is_confirmed === false &&
            <ShowError message="E-mail de confirmação da viagem enviado, favor verificar sua caixa de e-mails. Após a confirmação, serão enviados os e-mails para todos os participantes." />
         }
      </>

   )
}