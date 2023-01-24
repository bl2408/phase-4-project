export const displayDate =(timestamp)=>{
    const t = new Date(timestamp)
    return `${t.toLocaleDateString()} ${t.toLocaleTimeString()}`;
};
export const ISODate =(timestamp)=>{
    const t = new Date(timestamp)
    return t.toISOString().split(".")[0];
};
