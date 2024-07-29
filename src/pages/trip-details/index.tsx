import { Calendar, Info, Plus } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Button } from "../../components/button";

export const TripDetailsPage = () => {

   const currentWidth = window.innerWidth;

   const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
   const [isShowedActivityMobile, setIsShowedActivityMobile] = useState(true);
   const [isShowedDetailsMobile, setIsShowedDetailsMobile] = useState(currentWidth > 1023 ? true : false);

   const openCreateActivityModal = () => {
      setIsCreateActivityModalOpen(true);
   }
   const closeCreateActivityModal = () => {
      setIsCreateActivityModalOpen(false);
   }

   const showActivityMobile = () => {
      setIsShowedActivityMobile(true)
      setIsShowedDetailsMobile(false)
   }
   const showDetailsMobile = () => {
      setIsShowedActivityMobile(false)
      setIsShowedDetailsMobile(true)
   }

   return (
      <div className="max-w-6xl px-2 md:px-6 py-10 mx-auto space-y-8">

         <DestinationAndDateHeader />

         <main className="flex flex-col lg:flex-row gap-16 px-6">

            {isShowedActivityMobile &&
               <section className="flex-1 space-y-6 mb-20 lg:mb-0">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl md:text-3xl semibold flex-1">Atividades</h2>
                     <Button variantColor="primary" onClick={openCreateActivityModal} >
                        <Plus className='size-5' />
                        Nova Atividade
                     </Button>
                  </div>

                  <Activities />

               </section>
            }

            {isShowedDetailsMobile &&
               <aside className="w-full lg:w-80 space-y-6 mb-20 lg:mb-0">
                  <ImportantLinks />
                  <div className='w-full h-px bg-zinc-800' />
                  <Guests />
               </aside>
            }

         </main>

         <div className="lg:hidden fixed bottom-0 left-0 right-0 p-5 backdrop-blur-sm ">
            <div className="flex justify-around shadow-shape bg-zinc-900 p-3 rounded-lg gap-2">
               <Button variantColor={isShowedActivityMobile ? 'primary' : 'secondary'} size="full" onClick={showActivityMobile} >
                  <Calendar className="size-5" />
                  Atividades
               </Button>
               <Button variantColor={isShowedDetailsMobile ? 'primary' : 'secondary'} size="full" onClick={showDetailsMobile} >
                  <Info className='size-5' />
                  Detalhes
               </Button>
            </div>
         </div>

         {/* AREA DO MODAL DE CRIAR NOVA ATIVIDADE  */}
         {isCreateActivityModalOpen &&
            <CreateActivityModal closeCreateActivityModal={closeCreateActivityModal} />
         }

      </div>

   )
}