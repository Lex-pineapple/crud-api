function validateTestData(data: any) {
  const keys = Object.keys(data);
  if (keys.length !== 3)
    return {
      isValid: false,
      data,
    };
  if (typeof data.age !== 'number')
    return {
      isValid: false,
      data,
    };
  if (typeof data.username !== 'string')
    return {
      isValid: false,
      data,
    };
  if (!(data.hobbies instanceof Array))
    return {
      isValid: false,
      data,
    };
  if (data.hobbies.length > 0 && !data.hobbies.every((i: any) => typeof i === 'string'))
    return {
      isValid: false,
      data,
    };

  return {
    isValid: true,
    data,
  };
}

export default validateTestData;
