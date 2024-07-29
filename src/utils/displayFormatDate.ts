import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"


export const displayDateFormat = (eventStartAndEndDates: DateRange | undefined) => {
   if (eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to) {

      const currentWidth = window.innerWidth;

      if (currentWidth > 767) {
         return `${format(eventStartAndEndDates.from, "d' de 'LLL", { locale: ptBR })} a ${format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR })}`
      } else {
         return `${format(eventStartAndEndDates.from, "d", { locale: ptBR })} a ${format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR })}`
      }


   } else {
      return null
   }

} 