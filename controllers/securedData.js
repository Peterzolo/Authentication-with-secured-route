

exports.getSecuredData = async (req, res, next) =>{
  res.status(201).json({
      success : true,
      data : "Access granted"
  })
}