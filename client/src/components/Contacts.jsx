import React, { useState } from 'react'
import axios from "axios";
import { ListItemText } from '@mui/material'
import { List } from '@mui/material'
import { ListItemButton } from '@mui/material'
import { useContacts } from '../contexts/Contacts'

const Contacts = (props) => {
    const [user, setUser] = useState(null);

    const handleListItemClick = (event, index) => {
        props.setSelectedIndex(index);
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data: data2 } = await axios.get(
            `http://localhost:4000/user/${props.match.params.id}`
            );
            console.log(data2);
            setUser(data2);
            setLoading(false);
          } catch (e) {
            setError(e);
            console.log(e);
          }
        };
        fetchData();
      }, [item]);

    const contactsList = contacts &&
                         contacts.map((contact, index) => {
                             return <ListItemButton
                                        key = {contact.id}
                                        selected = {selectedIndex === index}
                                        onClick={(event) => handleListItemClick(event, index)}
                                    >
                                        <ListItemText primary={contact.name} />
                                    </ListItemButton>
                         })

    return (
        <div>
            <List component="nav" aria-label="contacts">
                {contactsList}
            </List>
        </div>
    )

}

export default Contacts