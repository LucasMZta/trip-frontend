import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react"
import { Button } from "../../../components/button"
import { useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";
import { Modal } from "../../../components/modal";
import { ErrorItem } from "../../../utils/getErrorFromZod";
import { displayDateFormat } from "../../../utils/displayFormatDate";

type Props = {
   isGuestInputOpen: boolean
   openGuestInput: () => void
   closeGuestInput: () => void
   setDestination: (destination: string) => void
   eventStartAndEndDates: DateRange | undefined
   setEventStartAndEndDates: (dates: DateRange | undefined) => void
   errors: ErrorItem[]
}

export const DestinationAndDateStep = ({ closeGuestInput, setDestination, isGuestInputOpen, openGuestInput, setEventStartAndEndDates, eventStartAndEndDates, errors }: Props) => {

   const [isDatePicketOpen, setIsDatePickerOpen] = useState(false);
   const errorDestination = errors.find(item => item.field === 'destination')?.message
   const errorStartsAt = errors.find(item => item.field === 'starts_at')?.message
   const currentWidth = window.innerWidth;

   const displayedDate = displayDateFormat(eventStartAndEndDates)

   const openDatePicker = () => {
      setIsDatePickerOpen(true);
   }
   const closeDatePicker = () => {
      setIsDatePickerOpen(false);
   }

   return (
      <>
         <div className="md:h-16 bg-transparent md:bg-zinc-900 p-3 md:p-0 md:px-4 rounded-xl flex items-center flex-col md:flex-row md:shadow-shape gap-1 md:gap-3">
            <div className='rounded-xl md:rounded-none p-3 md:p-0 w-full flex items-center gap-2 flex-1'>
               <MapPin className='size-5 text-zinc-400' />
               <input
                  type="text"
                  disabled={isGuestInputOpen}
                  placeholder="Para onde voce vai?"
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
            </div>

            <button onClick={openDatePicker} disabled={isGuestInputOpen}
               className='rounded-xl md:rounded-none p-3 md:p-0 w-full flex items-center gap-2 text-left md:w-[248px]'>
               <Calendar className='size-5 text-zinc-400' />
               <span className="text-lg text-zinc-400 w-40 flex-1 ">
                  {displayedDate || 'Quando?'}
               </span>
            </button>

            {isDatePicketOpen &&
               <Modal>
                  <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
                     <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                           <h2 className='text-lg font-semibold'>Selecione a Data</h2>
                           <button type="button" onClick={closeDatePicker}><X className='size-5 text-zinc-400' /> </button>
                        </div>
                     </div>
                     <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} locale={ptBR} />
                  </div>
               </Modal>
            }

            <div className='hidden md:block w-px h-6 bg-zinc-800' />

            {isGuestInputOpen ? (
               <Button variantColor="secondary" onClick={closeGuestInput} size={`${currentWidth > 767 ? 'default' : 'full'}`}  >
                  Alterar local/data
                  <Settings2 className='size-5' />
               </Button>
            ) : (
               <Button variantColor="primary" onClick={openGuestInput} size={`${currentWidth > 767 ? 'default' : 'full'}`} >
                  Continuar
                  <ArrowRight className='size-5' />
               </Button>
            )}

         </div>

         {errorDestination &&
            <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorDestination}</div>
         }
         {errorStartsAt &&
            <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorStartsAt}</div>
         }
      </>


   )
}