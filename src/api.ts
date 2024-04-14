import { ToOrderListSimple } from "./scripts"

export interface ToOrderListsItem {
    id: number,
    datetime: string,
    toOrderList: ToOrderListSimple
}

export const addToOrderList = (user: string, toOrderList: ToOrderListSimple) => {
    const toOrderLists: ToOrderListsItem[] = JSON.parse(localStorage.getItem(user) || "[]");
    
    toOrderLists.push({
        id: toOrderLists.length,
        datetime: new Date().toISOString(),
        toOrderList,
    })

    localStorage.setItem(user, JSON.stringify(toOrderLists));
}

export const getToOrderLists = (user: string) => {
    return JSON.parse(localStorage.getItem(user) || "[]");
}