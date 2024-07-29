
type Props = {
   message: string;
}

export const ShowError = ({ message }: Props) => {
   return (
      <div className='bg-red-400/70 text-red-950 rounded-md p-2'>{message}</div>
   )

}