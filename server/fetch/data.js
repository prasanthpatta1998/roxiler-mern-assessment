const fetchData = async () =>{
    try{
        const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
        return response.json()
    }catch(err){
        console.error('Error fetching data:', err);
    }
}

module.exports = fetchData