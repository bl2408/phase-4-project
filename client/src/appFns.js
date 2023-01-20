export const displayDate =(timestamp)=>{
    const t = new Date(timestamp)
    return t.toDateString();
};