import { CircleCheck, Trash2 } from "lucide-react"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
   date: string;
   activities: {
      id: string;
      title: string;
      occurs_at: string;
   }[]
}

export const Activities = () => {

   const { tripId } = useParams();
   const [activities, setActivities] = useState<Activity[]>([]);

   useEffect(() => {
      api.get(`/trips/${tripId}/activities`).then(response => setActivities(response.data.activities))
   }, [tripId])

   const deleteActivity = () => {
      alert('Voce irá deletar uma atividade');
   }

   return (
      <div className="space-y-8">
         {activities.map(day => (
            <div key={day.date} className={`space-y-2.5 ${new Date(day.date) < new Date() ? 'opacity-50' : ''} `}>
               <div className="flex gap-2 items-baseline">
                  <span className="text-xl text-zinc-300 font-semibold">Dia {format(day.date, 'd')} </span>
                  <span className="text-xs text-zinc-500">{format(day.date, 'EEEE', { locale: ptBR })}</span>
               </div>
               {day.activities.length > 0 ?
                  <div className="space-y-2.5">
                     {day.activities.map(activity => (
                        <div key={activity.id} className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                           <CircleCheck className="size-5 text-lime-300" />
                           <span className="text-zinc-100 flex-1">{activity.title}</span>
                           <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')}h</span>
                           <Trash2 className="size-5 text-zinc-300 cursor-pointer" onClick={deleteActivity} />
                        </div>
                     ))}
                  </div>
                  :
                  <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
               }

            </div>
         ))}
      </div>
   )
}