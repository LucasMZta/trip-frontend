import { AtSign, User, X } from "lucide-react"
import { FormEvent } from "react"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { ErrorItem } from "../../utils/getErrorFromZod"
import { ShowError } from "../../components/show-error"
import { DateRange } from "react-day-picker"
import { displayDateFormat } from "../../utils/displayFormatDate"

interface ConfirmTripModalProps {
   closeConfirmTripModal: () => void
   createTrip: (e: FormEvent<HTMLFormElement>) => void
   setOwnerName: (name: string) => void
   setOwnerEmail: (email: string) => void
   errors: ErrorItem[]
   destination: string
   eventStartAndEndDates: DateRange | undefined
   isLoading: boolean
}

export const ConfirmTripModal = ({ closeConfirmTripModal, createTrip, setOwnerEmail, setOwnerName, errors, destination, eventStartAndEndDates, isLoading }: ConfirmTripModalProps) => {

   const errorConfirmTripName = errors.find(item => item.field === 'ownerName')?.message
   const errorConfirmTripEmail = errors.find(item => item.field === 'ownerEmail')?.message
   const errorOccursAt = errors.find(item => item.field === 'occurs_at')?.message

   const displayedDate = displayDateFormat(eventStartAndEndDates)

   return (
      <Modal>
         <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
            <div className='space-y-2'>
               <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Confirmar criação da viagem</h2>
                  <button type="button" onClick={closeConfirmTripModal}><X className='size-5 text-zinc-400' /> </button>
               </div>
               <p className='text-sm text-zinc-400'>
                  Para concluir a criação da viagem para <span className='text-zinc-100 font-semibold'> {destination} </span> nas datas de <span className='text-zinc-100 font-semibold'> {displayedDate} </span> preencha seus dados abaixo:
               </p>
            </div>
            <form onSubmit={createTrip} className='space-y-3'>
               <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                  <User className='text-zinc-400 size-5' />
                  <input
                     type="text"
                     name='name'
                     placeholder="Seu nome completo"
                     onChange={(e) => setOwnerName(e.target.value)}
                     required
                     className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
               </div>
               {errorConfirmTripName &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorConfirmTripName}</div>
               }
               <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                  <AtSign className='text-zinc-400 size-5' />
                  <input
                     type="email"
                     name='email'
                     required
                     placeholder="Seu e-mail pessoal"
                     onChange={(e) => setOwnerEmail(e.target.value)}
                     className="bg-transparent text-lg placeholder-zinc-400  outline-none flex-1" />
               </div>
               {errorConfirmTripEmail &&
                  <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorConfirmTripEmail}</div>
               }
               {errorOccursAt &&
                  <ShowError message={errorOccursAt} />
               }
               <Button type="submit" variantColor="primary" size="full" disabled={isLoading} >
                  {isLoading ? 'Loading...' : 'Confirmar criação da viagem'}
               </Button>
            </form>


         </div>
      </Modal>
   )
}