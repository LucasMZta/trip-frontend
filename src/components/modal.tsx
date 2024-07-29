import { ReactNode } from 'react';


interface ModalType {
   children: ReactNode;
}

export const Modal = ({ children }: ModalType) => {
   return (
      <div className='mx-2 fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-50'>
         {children}
      </div>
   )
}