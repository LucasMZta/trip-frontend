import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destination-and-date-step';
import { InviteGuestsSteps } from './steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';
import { z } from 'zod';
import { ErrorItem, getErrorFromZod } from '../../utils/getErrorFromZod';
import { AxiosError } from 'axios';

export const CreateTripPage = () => {

   const navigate = useNavigate();
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   const [isGuestInputOpen, setIsGuestInputOpened] = useState(false);
   const [isGuestModalOpen, setIsGuestModalOpened] = useState(false);
   const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
   const [alertHasInvited, setAlertHasInvited] = useState(false);
   const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
   const [errors, setErrors] = useState<ErrorItem[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const [destination, setDestination] = useState('');
   const [ownerName, setOwnerName] = useState('');
   const [ownerEmail, setOwnerEmail] = useState('');
   const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>();

   const destinationSchema = z.object({
      destination: z.string().min(2, 'Your destiny is missing.'),
      starts_at: z.coerce.date().refine(date => typeof date !== 'string', {
         message: 'The date is missing.',
      }).refine(date => date >= today, {
         message: 'Invalid trip start date. Its before or same current day.',
      }),
   })
   const emailSchema = z.object({
      emailsToInvite: z.string().email('E-mail format invalid.')
   })
   const confirmTripSchema = z.object({
      ownerName: z.string().min(3, 'Your full name is missing.'),
      ownerEmail: z.string().email('E-mail format invalid.')
   })
   const openGuestInput = () => {
      setErrors([]);
      const data = destinationSchema.safeParse({
         destination: destination,
         starts_at: eventStartAndEndDates?.from
      });
      // console.log(data.error?.errors)
      if (!data.success) return setErrors(getErrorFromZod(data.error));

      setErrors([]);
      setIsGuestInputOpened(true);
   }
   const closeGuestInput = () => {
      setIsGuestInputOpened(false);
   }
   const openGuestModal = () => {
      setIsGuestModalOpened(true);
   }
   const closeGuestModal = () => {
      setIsGuestModalOpened(false);
   }
   const openConfirmTripModal = () => {
      setIsConfirmTripModalOpen(true);
   }
   const closeConfirmTripModal = () => {
      setIsConfirmTripModalOpen(false);
   }
   const addNewEmailToInvite = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors([]);
      setAlertHasInvited(false);
      console.log('From: ', eventStartAndEndDates?.from)

      const data = new FormData(e.currentTarget);
      const email = data.get('email')?.toString();

      const schema = emailSchema.safeParse({
         emailsToInvite: email
      })

      if (!schema.success) return setErrors(getErrorFromZod(schema.error));

      //validar se teve email enviado
      if (!email) { return }
      //validar se já nao existe email igual convidado
      if (!emailsToInvite) return

      if (emailsToInvite.includes(schema.data.emailsToInvite)) {
         setAlertHasInvited(true);
         return
      }
      //caso tudo de certo, faz o clone dos emails e adiciona o novo email
      setEmailsToInvite([...emailsToInvite, email]);
      setErrors([]);
      setAlertHasInvited(false);

      e.currentTarget.reset();
   }
   const removeEmailFromInvite = (email: string) => {
      if (emailsToInvite) {
         const newEmailList = emailsToInvite.filter(invited => invited !== email);
         setEmailsToInvite(newEmailList);
      }
   }

   const createTrip = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors([]);
      setIsLoading(true)

      const schema = confirmTripSchema.safeParse({
         ownerName,
         ownerEmail
      })

      if (!schema.success) {
         setIsLoading(false);
         return setErrors(getErrorFromZod(schema.error));
      }

      if (!destination) return
      if (emailsToInvite.length === 0) return
      // if (!ownerName || !ownerEmail) return
      if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) return

      try {
         const response = await api.post('/trips', {
            destination: destination,
            starts_at: eventStartAndEndDates.from,
            ends_at: eventStartAndEndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
         });

         const { tripId } = response.data;
         setTimeout(() => {
            setIsLoading(false)
         }, 1000)
         navigate(`/trips/${tripId}`);

      } catch (error) {
         setIsLoading(false)
         if (error instanceof AxiosError) {
            if (error.response?.data.message) {
               // console.log(error.response.data.message)
               setErrors([{ field: 'occurs_at', message: error.response.data.message }])
            }
         }
      }
   }
   return (
      <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
         <div className="max-w-3xl w-full px-6 text-center space-y-10">
            <div className='flex flex-col items-center gap-3'>
               <img src="/logo.svg" alt="Plann.er" />
               <p className="zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
            </div>

            <div className='bg-zinc-900 md:bg-transparent md:space-y-4 shadow-shape md:shadow-none rounded-xl'>

               <DestinationAndDateStep
                  isGuestInputOpen={isGuestInputOpen}
                  closeGuestInput={closeGuestInput}
                  openGuestInput={openGuestInput}
                  setDestination={setDestination}
                  eventStartAndEndDates={eventStartAndEndDates}
                  setEventStartAndEndDates={setEventStartAndEndDates}
                  errors={errors}
               />

               <div className='block md:hidden h-px w-full bg-zinc-800' />

               {isGuestInputOpen &&
                  <InviteGuestsSteps
                     emailsToInvite={emailsToInvite}
                     openConfirmTripModal={openConfirmTripModal}
                     openGuestModal={openGuestModal}
                  />
               }

            </div>

            <p className="text-sm text-zinc-500">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
               com nossos <a href="#" className="text-zinc-300 underline"> termos de uso</a> e <a href="#" className="text-zinc-300 underline"> políticas de privacidade</a>.</p>
         </div>

         {isGuestModalOpen &&
            <InviteGuestsModal
               emailsToInvite={emailsToInvite}
               addNewEmailToInvite={addNewEmailToInvite}
               alertHasInvited={alertHasInvited}
               closeGuestModal={closeGuestModal}
               removeEmailFromInvite={removeEmailFromInvite}
               errors={errors}
            />

         }

         {isConfirmTripModalOpen &&
            <ConfirmTripModal
               closeConfirmTripModal={closeConfirmTripModal}
               createTrip={createTrip}
               setOwnerName={setOwnerName}
               setOwnerEmail={setOwnerEmail}
               errors={errors}
               destination={destination}
               eventStartAndEndDates={eventStartAndEndDates}
               isLoading={isLoading}
            />
         }

      </div>
   )
}
