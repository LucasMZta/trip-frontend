import { AtSign, Plus, X } from "lucide-react"
import { FormEvent } from "react"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { ErrorItem } from "../../utils/getErrorFromZod"

interface InviteGuestsModalProps {
    emailsToInvite: string[]
    alertHasInvited: boolean
    closeGuestModal: () => void
    addNewEmailToInvite: (e: FormEvent<HTMLFormElement>) => void
    removeEmailFromInvite: (email: string) => void
    errors: ErrorItem[]
}

export const InviteGuestsModal = ({ addNewEmailToInvite, alertHasInvited, closeGuestModal, emailsToInvite, removeEmailFromInvite, errors }: InviteGuestsModalProps) => {

    const errorInvite = errors.find(item => item.field === 'emailsToInvite')?.message

    return (
        <Modal>
            <div className='w-[640px] py-5 px-6 shadow-shape bg-zinc-900 space-y-5' >
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Selecionar Convidados</h2>
                        <button type="button" onClick={closeGuestModal}><X className='size-5 text-zinc-400' /> </button>
                    </div>
                    <p className='text-sm text-zinc-400'>Os convidados irão receber e-mails para confirmar a participação na viagem.</p>
                </div>

                <div className='flex flex-wrap gap-2'>
                    {emailsToInvite.length === 0 ?
                        <p className='text-center text-zinc-600 py-2 w-full '>Voce ainda não selecionou nenhum convidado!</p>
                        :
                        emailsToInvite.map((email, key) => (
                            <div key={key} className='py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2'>
                                <span className='text-zinc-300'> {email} </span>
                                <button type="button" onClick={() => removeEmailFromInvite(email)} > <X className='size-4 text-zinc-400' /> </button>
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
                {alertHasInvited &&
                    <div className='bg-red-400/70 text-red-950 rounded-md p-2'>
                        Email já cadastrado!
                    </div>
                }
                {errorInvite &&
                    <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{errorInvite}</div>
                }
            </div>
        </Modal >
    )
}