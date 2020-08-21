export const compareDates = (date1: Date, date2: Date): boolean => {
    return new Date(Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate())).getTime()
        === new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate())).getTime();
}