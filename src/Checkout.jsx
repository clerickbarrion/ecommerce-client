import React, { useEffect, useState } from 'react'
import './css/Checkout.scss'

function Cart(){

  let total = 0

  try{
    JSON.parse(localStorage.getItem('cart')).forEach(item =>{
      total += Number(item.price)
    })
  }catch{}
  

  return (
    <>
      <aside>
        <h2>Cart</h2>
        <div id='cart-items'>
          {JSON.parse(localStorage.getItem('cart')).map(item=>{
            return <CartItem name={item.name} price={item.price} image={item.image}/>
          })}
        </div>
        <p id='total'>Total: ${total.toFixed(2)}</p>
      </aside>
    </>
  )
}


function CartItem(props){

  function removeItem(e){

    const total = Number(document.getElementById('total').textContent.replace('Total: $',''))

    e.target.parentElement.parentElement.remove()

    const cart = JSON.parse(localStorage.getItem('cart'))

    for (let i = 0; i<cart.length; i++) {
      if (cart[i].name === props.name) {
        document.getElementById('total').textContent = `Total: $${(total - Number(props.price)).toFixed(2)}`
        cart.splice(i,1); 
        break;}
  }


  localStorage.setItem('cart', JSON.stringify(cart))

  const data = {
    username: localStorage.getItem('username'),
    cart: localStorage.getItem('cart')
  }

  const options = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
  }
  fetch('http://localhost:4000/api/updateCart', options)

  }

  return (
    <>
    <details>
      <summary>{props.name}</summary>
      <img src={require(`${props.image}`)}/>
      <div>
        <p>${props.price}</p>
        <button onClick={removeItem}>Remove from cart</button>
      </div>
    </details>
    </>
  )
}


export default function Checkout() {

  function purchase(e){
    e.preventDefault()
    const username = localStorage.getItem('username')
    const items = localStorage.getItem('cart')
    const total = document.getElementById('total').textContent
    const deliver_date = document.getElementById('deliver_date').value
    const purchase_date = new Date()
    const address = document.getElementById('address').value
    const country = document.getElementById('country').value
    const email = document.getElementById('email').value
    const error = document.getElementById('error-msg')

    if (!country,!address,!email) error.textContent = 'Enter all required fields'
    else if (!deliver_date || (Number(new Date(deliver_date)) < Number(purchase_date) + 172800000)) error.textContent = 'Select a deliver date at least 2 days from now'
    else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) error.textContent = "Enter a valid email"
    else if (total === 'Total: $0.00') {error.textContent = 'No item in cart'}
    else {
      let data = {
        username,
        items,
        total,
        deliver_date,
        purchase_date,
        address,
      }
    
      let options = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
      }
      fetch('http://localhost:4000/api/uploadHistory',options)
  
      localStorage.setItem('cart','[]')
  
      data = {
        username,
        cart: localStorage.getItem('cart')
      }
  
      options = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
      }
  
      fetch('http://localhost:4000/api/updateCart',options)
  
      window.location = `${window.location.origin}/account`
    }
  }

  return (
    <div className='checkout'>
      <main>
        <section>
          <h2>Deliver Information</h2>
          <p id='error-msg'></p>
          <small>*indicates required</small>
          <form>
            <div>
              <input id='country' placeholder='*Country'/>
            </div>
            {/* <div>
              <input  id='discount' placeholder='Discount Code'/>
            </div> */}
            <div>
              <input id='email'placeholder='*Email'/>
            </div>
            <div>
              <input id="address"placeholder='*Delivery Address'/>
            </div>
            <div>
              <input id='deliver_date' type='datetime-local' placeholder='Select Arrival Date'/>
            </div>
            <button onClick={purchase}>Purchase</button>
          </form>
        </section>
        <Cart/>
      </main>
    </div>
  )
}
