export const displayDate =(timestamp)=>{
    const t = new Date(timestamp)
    return `${t.toLocaleDateString()} ${t.toLocaleTimeString()}`;
};
export const ISODate =(timestamp)=>{
    const t = new Date(timestamp)
    return t.toISOString().split(".")[0];
};

export const formatOdometer = (number)=>{
    const unit = "km"
    if(!number || number.length >=0){ number = 0}
    return `${number.toLocaleString("en-US")} ${unit}`;

};
