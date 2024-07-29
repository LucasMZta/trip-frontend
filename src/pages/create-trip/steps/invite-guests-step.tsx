import { ArrowRight, UserRoundPlus } from "lucide-react"
import { Button } from "../../../components/button";

type Props = {
    openGuestModal: () => void;
    emailsToInvite: string[];
    openConfirmTripModal: () => void;
}

export const InviteGuestsSteps = ({ emailsToInvite, openConfirmTripModal, openGuestModal }: Props) => {

    const currentWidth = window.innerWidth;

    return (
        <div className="md:h-16 bg-zinc-900 p-3 py-4 md:p-0 md:py-0 md:px-4 rounded-xl flex items-center flex-col md:flex-row md:shadow-shape gap-3">
            <button type="button" onClick={openGuestModal} className='flex w-full md:w-auto items-center gap-2 flex-1'>
                <UserRoundPlus className='size-5 text-zinc-400' />
                {emailsToInvite.length === 0 ?
                    <span className='text-zinc-400 text-lg flex-1 text-left'> Quem estará na viagem? </span>
                    :
                    <span className='text-zinc-100 text-lg flex-1 text-left'>  {emailsToInvite.length} pessoa(s) convidada(s) </span>
                }
            </button>
            <div className='hidden md:block w-px h-6 bg-zinc-800' />
            <Button variantColor="primary" onClick={openConfirmTripModal} disabled={emailsToInvite.length === 0 ? true : false} size={`${currentWidth > 767 ? 'default' : 'full'}`} >
                Confirmar Viagem
                <ArrowRight className='size-5' />
            </Button>
        </div>
    )
}