import { useEffect, useState } from "react";

useLocalStorage = (key, initialValue) => {
    const session = 'hobokenMarket-' + key
    const [value, setValue] = useState(() => {
        const json = localStorage.getItem(session)
        if (json != null) return JSON.parse(json)
        if (typeof initialValue === 'function') {
            return initialValue()
        } else {
            return initialValue
        }
    })

    useEffect(() => {
        localStorage.setItem(session, JSON.stringify(value))
    }, [session, value])

    return [value, setValue]

}

export default useLocalStorage;