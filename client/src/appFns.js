export const displayDate =(timestamp)=>{
    const t = new Date(timestamp)
    return t.toString();
};
export const ISODate =(timestamp)=>{
    const t = new Date(timestamp)
    return t.toISOString().split(".")[0];
};
