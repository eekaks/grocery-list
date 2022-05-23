import { useState, useEffect } from 'react'
import groceryService from './services/groceryService'

const Groceries = (props) => {
  return (
    <div className="groceries">
      {props.groceries.map(item =>
        <Item key={item.name} item={item} removeItem={props.removeItem} />
        )}
    </div>    
  )
}

const MostItem = (props) => {
  if (props.item === null) {
    return null
  }
  return (
  <div>
    {props.item.name}
  </div>
  )
}

const Item = (props) => {  
  if (props.item === null) {
    return null
  }
  console.log(props.item.name)
  return (
    <>
      <div className="item">
        {props.item.name} price {props.item.price} qty {props.item.quantity}
      </div>
      <button onClick={() => props.removeItem(props.item)}>delete</button>
    </>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const ItemForm = (props) => {
  return (
    <form onSubmit={props.addItem}>
      <div className="inputtext">
        item: <input className="inputbox"
                value={props.newItem}
                onChange={props.handleItemChange}
                />
      </div>
      <div>
        price: <input className="inputbox"
                value={props.newPrice}
                onChange={props.handlePriceChange}
                />
      </div>
      <div>
        qty: <input className="inputbox"
              value={props.newQuantity}
              onChange={props.handleQuantityChange}
              />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [groceries, setGroceries] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [infoMessage, setNewInfoMessage] = useState(null)
  const [errorMessage, setNewErrorMessage] = useState(null)

  useEffect(() => {
    groceryService
      .getAll()
        .then(initialGroceries => {
          setGroceries(initialGroceries)             
        })
  }, [])

  const addItem = (event) => {
    event.preventDefault()
    const newEntry = {
      name : newItem,
      price : newPrice,
      quantity : newQuantity
    }

    if (groceries.find(item => item.name === newEntry.name)) {
      setNewErrorMessage(`${newEntry.name} already on the grocery list`)
      setTimeout(() => {
        setNewErrorMessage(null)
      }, 3000)
    } else {
      groceryService
        .create(newEntry)
          .then(returnedEntry => {
            setGroceries(groceries.concat(returnedEntry))
            setNewInfoMessage(
              `Added ${returnedEntry.name}`
            )
            setTimeout(() => {
              setNewInfoMessage(null)
            }, 3000);
          })
    }
    setNewItem('')
    setNewPrice('')
    setNewQuantity('')
  }

  const removeItem = (item) => {
    const result = window.confirm(`Delete ${item.name}?`)
    console.log(item)
    if (result) {
      groceryService
        .remove(item.id)
          .then(deletedEntry => {
            setGroceries(groceries.filter(olditem => olditem.id !== item.id))
            setNewInfoMessage(
              `Removed ${item.name}`
            )
            setTimeout(() => {
              setNewInfoMessage(null)
            }, 3000)
          })
          .catch(error => {
            setNewErrorMessage(
              `${item.name} has already been removed from the server`
            )
            setTimeout(() => {
              setNewErrorMessage(null)
            }, 3000)
            setGroceries(groceries.filter(olditem => olditem.id !== item.id))
          })
    } else {
      console.log("plop")
    }
  }

  const findMost = (groceries) => {
    if (groceries.length > 0)
    {
      let maxPrice = groceries.reduce((max, item) => max.price > item.price ? max : item)
      return maxPrice
    }
    else
    {
      return null
    }
  }

  const findLeast = (groceries) => {
    if (groceries.length > 0)
    {
      console.log("plop")
      return groceries.reduce((min, item) => min.price < item.price ? min : item)
    }
    else
    {
      return null
    }
  }

  const handleItemChange = (event) => {
    setNewItem(event.target.value)
  }

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value)
  }

  const handleQuantityChange = (event) => {
    setNewQuantity(event.target.value)
  }

  return (
    <div>
      <h1>Grocery list</h1>
      <Notification message={infoMessage} />
      <ErrorNotification message={errorMessage} />

      <h2>Add new item to list</h2>

      <ItemForm
        addItem={addItem}
        newItem={newItem}
        newPrice={newPrice}
        newQuantity={newQuantity}
        handleItemChange={handleItemChange}
        handlePriceChange={handlePriceChange}
        handleQuantityChange={handleQuantityChange} 
      />
      <h3>The least expensive item</h3>
      <MostItem removeItem={removeItem} item={findLeast(groceries)} />

      <h3>The most expensive item</h3>
      <MostItem removeItem={removeItem} item={findMost(groceries)} />

      <h2>Groceries</h2>

      <Groceries groceries={groceries} removeItem={removeItem} setGroceries={setGroceries}/>


    </div>
  )

}



export default App
