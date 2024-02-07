import React, { useState } from 'react'
import "./platform.css"
import Button from '../button/button'
import Modal from '../modal/modal'

const Platform = ({id="", name="", value="", notification="", del}) => {
    const [isOpen, setOpen] = useState(false)

    return (
        <div className='platform'>
            <div className='platform-data'>
                <div className='platform-title'>
                    {name}
                </div>
                <div>
                    Места: {value}
                </div>
            </div>
            <div className='platform-data'>
                <div className='platform-id'>
                    ID: {id}
                </div>
                <div>
                    <i onClick={() => (setOpen(true))} className="fa fa-remove platform-del"></i>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={"Удаление самолёта из бд"}>
                <div className="platform-bottom">
                    Удаление самолёта приведёт к удалению его данных и рейсов с информацией о бронированиях.
                </div>
                <div className="platform-bottom">
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <div className='notification'>{notification}</div>
                    <Button onClick={() => del()} type={"danger"}>Удалить</Button>
                </div>
            </Modal>
        </div>
    )
}

export default Platform
