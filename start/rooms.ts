import RoomNames from 'App/services/RoomNames'
import Rooms from 'App/services/Rooms'

Rooms.boot()
Rooms.addRoom('first-card-room', 'Card')
Rooms.addRoom('first-tabula-room', 'Tabula')

RoomNames.boot()
