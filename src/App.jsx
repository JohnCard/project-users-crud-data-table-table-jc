import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSnackbar } from "notistack";

const baseUrl = "https://jsonplaceholder.typicode.com/users/";
const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function App() {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState('')
  const [userId, setUserId] = useState('')
  const [letId, setLetId] = useState(11)
  const [title, setTitle] = useState('Not users found!')
  const { enqueueSnackbar } = useSnackbar()

  const validateEmail = email => regex.test(email)

  const deleteUser = id => {
    fetch(baseUrl+id, {
      method: 'delete'
    })
    .then(response => response.json())
    .then(data => {
      console.info(data)
      setUsers(prev => prev.filter(user => user.id != id))
      enqueueSnackbar('Deleted user!', {
        variant: 'error',
        anchorOrigin: {
          horizontal: 'left',
          vertical: 'bottom'
        }
      })
    })
    .catch(error => console.error(error))
    .id(() => console.info('deleted'))
  }

  const updateMethod = (id) => {
    setUserId(id)
    setMethod('put')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(!validateEmail(email)){
      enqueueSnackbar('Not valid email!', {
        variant: 'error',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        }
      })
      return
    }

    let bodyRequest = {
      email: email
    }
    if(method == 'put' || method == 'post'){
      bodyRequest.name = name
      bodyRequest.username = username
    }
    bodyRequest = JSON.stringify(bodyRequest)
    fetch(baseUrl+userId, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyRequest
    })
    .then(response => {
      if(!response.ok){
        throw new Error('Not valid request')
      }
      return response.json()
    })
    .then(data => {
      // if(method == 'put' || method == 'patch') setUsers(prev => prev.filter(user => user.id != userId))
      if(method == 'put'){
        setUsers(prev => prev.filter(user => user.id != userId))
        setUsers(prev => [...prev, data])
        enqueueSnackbar(`updated ${data.name} user!`, {
          variant: 'success',
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom'
          }
        })
      } 
      if(method == 'post'){
        setUsers(prev => [...prev, {...data, id: letId}])
        setLetId(prev => prev+1)
        enqueueSnackbar(`created ${data.name} user!`, {
          variant: 'success',
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom'
          }
        })
      }
    })
    .catch(error => {
      console.error(error)
      enqueueSnackbar('Not valid data!', {
        variant: 'error',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        }
      })
    })
    .finally(() => {
      setName('')
      setEmail('')
      setUsername('')
      setUserId('')
    })
  }

  const pullUsers = () => {
    fetch(baseUrl)
      .then(response => {
        if(!response.ok) {
          enqueueSnackbar('not user data!', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          })
          throw new Error("Failed request")
        }
        return response.json();
      })
      .then(data => {
        setUsers(data)
        setColumns([
          {
            name: "Name",
            selector: row => row.name,
          },
          {
            name: "Username",
            selector: row => row.username,
          },
          {
            name: "Email",
            selector: row => row.email,
          },
          {
            name: 'Update user',
            selector: row => <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => updateMethod(row.id)}
                                data-bs-toggle='modal'
                                data-bs-target='#createUpdateModal'
                              >Update</button>
          },
          // {
          //   name: 'Patch user',
          //   selector: row => <button
          //     type="button"
          //     className="btn btn-warning"
          //     onClick={() => updateMethod('patch', row.id)}
          //     data-bs-toggle='modal'
          //     data-bs-target='#patchModal'
          //   >Patch</button>
          // }
          {
            name: 'Delete',
            selector: row => <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteUser(row.id)}
            >Delete</button>
          }
        ]);
        enqueueSnackbar('users data loaded successfully!', {
          variant: 'success',
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
          }
        })
        setTitle('Successful request!')
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => console.log("request!"));
  }

  useEffect(() => {
    pullUsers()
  }, []);

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="createUpdateModal"
        tabIndex="-1"
        aria-labelledby="createUpdateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="createUpdateModalLabel">
                Modal title
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleSubmit}
              >
                <div className="row">
                  <div className="col-12 col-md-6">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      aria-label="user-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      aria-label="user-username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      aria-label="user-email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <button
                      type="submit"
                      className="btn btn-primary mt-3"
                      data-bs-dismiss='modal'
                      aria-label="save-btn"
                    >
                      Save user
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal ends */}
      <div className="container my-4">
        <h1>{title}</h1>
        <div className="row">
          {/* Button trigger modal */}
          <button
            type="button"
            className="btn btn-warning w-25 my-4"
            data-bs-toggle="modal"
            data-bs-target="#createUpdateModal"
            onClick={() => setMethod('post')}
          >
            Create user
          </button>
          {/* Button trigger modal ends */}
          <DataTable data={users} columns={columns} />
        </div>
      </div>
    </>
  );
}

export default App;
