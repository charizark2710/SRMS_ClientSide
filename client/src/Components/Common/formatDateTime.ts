export const formatDate=(date:string)=>{
    let year=date.substring(0, 4);
    let month=date.substring(4,6);
    let day=date.substring(6);
    let formatedDate = year+"-"+month+"-"+day;
    return formatedDate;
}

export const formatTime=(time:string)=>{
    let hour=time.substring(0,2);
    let minus=time.substring(2,4);
    let sencond=time.substring(4,6);
    let formatedTime=hour+":"+minus+":"+sencond;
    return formatedTime;
}

export const formatDateTime=(dateTime:string)=>{
    let dateAndTime=dateTime.split("-");
    let year=dateAndTime[0].substring(0, 4);
    let month=dateAndTime[0].substring(4,6);
    let day=dateAndTime[0].substring(6);
    let formatedDate = year+"-"+month+"-"+day; 

    let hour=dateAndTime[1].substring(0,2);
    let minus=dateAndTime[1].substring(2,4);
    let sencond=dateAndTime[1].substring(4,6);
    let formatedTime=hour+":"+minus+":"+sencond;

    return formatedDate+"T"+formatedTime
}