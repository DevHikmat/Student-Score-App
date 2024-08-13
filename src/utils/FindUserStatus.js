const STATUS = {
  JUNIOR: "junior",
  JUNIOR_PLUS: "junior+",
  MIDDLE: "middle",
  MIDDLE_PLUS: "middle+",
  SENIOR: "senior",
};

export const FindUserStatus = (ball) => {
  let status = "";
  if (ball < 100) status = STATUS.JUNIOR;
  else if (ball < 250) status = STATUS.JUNIOR_PLUS;
  else if (ball < 500) status = STATUS.MIDDLE;
  else if (ball < 2500) status = STATUS.MIDDLE_PLUS;
  else status = STATUS.SENIOR;

  return status;
};
