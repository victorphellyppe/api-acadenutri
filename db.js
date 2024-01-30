const customers = [
{
    id: 1,
    nome: 'Victor',
    idade: 29,
    uf: 'AL'
},

];


function selectCustomers() {
    return customers;
}

function selectCustomer(id) {
    return customers.find(cliente => cliente.id === id);
}

function insertCustomer(cliente) {
    customers.push(cliente);
}

function updateCustomer(id, customerData) {
    const customer = customers.find(c => c.id === id);
    if(!customer) return
    customer.nome = customerData.nome;
    customer.idade = customerData.idade;
    customer.uf = customerData.uf;

}

function deleteCustomer(id) {
    const index = customers.findIndex(c => c.id === id);
    customers.splice(index, 1);
}
module.exports = {
    selectCustomers,
    selectCustomer,
    insertCustomer,
    updateCustomer,
    deleteCustomer
}