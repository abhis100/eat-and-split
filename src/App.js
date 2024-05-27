import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [select, setSelect] = useState(null);

  function handleFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelection(friend) {
    setSelect((select) => (select?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === select.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          select={select}
          onSelect={handleSelection}
        />

        {showAddFriend && <AddFriend onAddFriend={handleFriends} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {select && (
        <FormSplitBill select={select} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, select, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} select={select} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function Friend({ friend, select, onSelect }) {
  const isSelected = select?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" /> <b>{friend.name}</b>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!image || !name) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> 🙋‍♂️Friend Name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🌆 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button> Add</Button>
    </form>
  );
}

function FormSplitBill({ select, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userBill, setUserBill] = useState("");
  const [whoPays, setWhoPays] = useState("you");
  const friendExpense = bill ? bill - userBill : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userBill) return;
    onSplitBill(whoPays === "you" ? friendExpense : -userBill);
  }

  return (
    <form className="form-split-bill">
      <h2> Split Bill with {select.name}</h2>
      <label> 💵 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label> 👶Your expense</label>
      <input
        type="text"
        value={userBill}
        onChange={(e) =>
          setUserBill(
            Number(e.target.value) > bill ? userBill : Number(e.target.value)
          )
        }
      />
      <label> 🙄{select.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />
      <label> 🤑Who is paying?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="you"> You </option>
        <option value="friend"> {select.name} </option>
      </select>
      <Button onClick={handleSubmit}> Split Bill </Button>
    </form>
  );
}
