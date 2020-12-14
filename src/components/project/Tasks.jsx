// import React, { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux'
// // import { auth, firestore } from '../../firebase'

// const Tasks = (props) => {
//   const state = useSelector((state) => state.Handleshowmember)
//   // let [list, setList] = useState([])
//   useEffect(() => {
//     let reanageList = []
//     let datalist = []
//     // let joblist=[]
//     state.member.forEach((item) => {
//       let data = {
//         user: item.displayName,
//         userID: item.userID,
//         tasks: [],
//       }
//       reanageList.push(data)
//     })
//     firestore
//       .collection('subtasks')
//       .where('project', '==', props.projectid)
//       .onSnapshot((doc) => {
//         doc.forEach((item) => {
//           datalist.push(item.id)
//         })
//       })
//   })
//   console.log(props)
//   console.log(state)
//   return <div></div>
// }
// export default Tasks
