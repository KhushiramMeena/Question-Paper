window.onbeforeunload = function (event) {
  return confirm("Do you want to reset the paper?");
};

document.getElementById("submitButton").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const easyPercentage = document.getElementById("easyPercentage").value.trim();
  const mediumPercentage = document
    .getElementById("mediumPercentage")
    .value.trim();
  const hardPercentage = document.getElementById("hardPercentage").value.trim();

  if (
    fileInput.files.length === 0 ||
    easyPercentage === "" ||
    mediumPercentage === "" ||
    hardPercentage === ""
  ) {
    alert("Please upload a file and fill in all input fields.");
  } else {
    $("#myModal").modal("show");
  }
});

function onSubmitButtonClick() {
  if (!document.getElementById("fileInput").files[0]) {
    alert("Please upload a JSON file");
    return;
  }

  displayQuestionsAfterSubmit();
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      const questionData = JSON.parse(content);
      sessionStorage.setItem("questionData", JSON.stringify(questionData));
    };
    reader.readAsText(file);
  }
}

// to store count result
let result = [];

function calculate_fn(
  easy_percent,
  easy_marks,
  medium_percent,
  medium_marks,
  hard_percent,
  hard_marks,
  level1,
  level2,
  level3
) {
  let remainder = 0;
  let no_of_easy, no_of_medium, no_of_hard;

  let easy = false,
    medium = false,
    hard = false;

  no_of_easy = Math.floor((easy_percent + remainder) / easy_marks);
  remainder = (easy_percent + remainder) % easy_marks;

  no_of_medium = Math.floor((medium_percent + remainder) / medium_marks);
  remainder = (medium_percent + remainder) % medium_marks;

  no_of_hard = Math.floor((hard_percent + remainder) / hard_marks);
  remainder = (hard_percent + remainder) % hard_marks;

  if (
    no_of_easy * easy_marks +
      no_of_hard * hard_marks +
      no_of_medium * medium_marks ==
    100
  ) {
    if (level1 == 0) {
      console.log("no of easy : " + no_of_easy + " ");
      result.push(no_of_easy);
    } else if (level2 == 0) {
      console.log("no of easy : " + no_of_medium + " ");
      result.push(no_of_medium);
    } else {
      console.log("no of easy : " + no_of_hard + " ");
      result.push(no_of_hard);
    }

    if (level1 == 1) {
      console.log("no of medium : " + no_of_easy + " ");
      result.push(no_of_easy);
    } else if (level2 == 1) {
      console.log("no of medium : " + no_of_medium + " ");
      result.push(no_of_medium);
    } else {
      console.log("no of medium : " + no_of_hard + " ");
      result.push(no_of_hard);
    }

    if (level1 == 2) {
      console.log("no of hard : " + no_of_easy + " ");
      result.push(no_of_easy);
    } else if (level2 == 2) {
      console.log("no of hard : " + no_of_medium + " ");
      result.push(no_of_medium);
    } else {
      console.log("no of hard : " + no_of_hard + " ");
      result.push(no_of_hard);
    }

    return true;
  }

  return false;
}

function func(
  easy_percent,
  easy_marks,
  medium_percent,
  medium_marks,
  hard_percent,
  hard_marks
) {
  if (
    calculate_fn(
      easy_percent,
      easy_marks,
      medium_percent,
      medium_marks,
      hard_percent,
      hard_marks,
      0,
      1,
      2
    )
  )
    return true;

  if (
    calculate_fn(
      easy_percent,
      easy_marks,
      hard_percent,
      hard_marks,
      medium_percent,
      medium_marks,
      0,
      2,
      1
    )
  )
    return true;

  if (
    calculate_fn(
      medium_percent,
      medium_marks,
      easy_percent,
      easy_marks,
      hard_percent,
      hard_marks,
      1,
      0,
      2
    )
  )
    return true;

  if (
    calculate_fn(
      medium_percent,
      medium_marks,
      hard_percent,
      hard_marks,
      easy_percent,
      easy_marks,
      1,
      2,
      0
    )
  )
    return true;

  if (
    calculate_fn(
      hard_percent,
      hard_marks,
      medium_percent,
      medium_marks,
      easy_percent,
      easy_marks,
      2,
      1,
      0
    )
  )
    return true;

  if (
    calculate_fn(
      hard_percent,
      hard_marks,
      easy_percent,
      easy_marks,
      medium_percent,
      medium_marks,
      2,
      0,
      1
    )
  )
    return true;

  return false;
}

function displayQuestionsAfterSubmit() {
  const questionDataString = sessionStorage.getItem("questionData");
  const questionData = JSON.parse(questionDataString);

  const easyPercentage = parseInt(
    document.getElementById("easyPercentage").value
  );
  const mediumPercentage = parseInt(
    document.getElementById("mediumPercentage").value
  );
  const hardPercentage = parseInt(
    document.getElementById("hardPercentage").value
  );

  const totalPercentage = easyPercentage + mediumPercentage + hardPercentage;

  if (totalPercentage !== 100) {
    alert("Total percentage should be 100%");
    return;
  }

  // const easyQuestionsCount = Math.round(
  //   (easyPercentage / 100) * questionData.data.length
  // );
  // const mediumQuestionsCount = Math.round(
  //   (mediumPercentage / 100) * questionData.data.length
  // );
  // const hardQuestionsCount = Math.round(
  //   (hardPercentage / 100) * questionData.data.length
  // );

  /////////////////changes*********/
  if (!func(easyPercentage, 5, mediumPercentage, 10, hardPercentage, 15)) {
    alert("Valid paper is not possible");
  }

  const easyQuestionsCount = result[0];
  const mediumQuestionsCount = result[1];
  const hardQuestionsCount = result[2];
  ///////////////////////////changes-end*********///////

  const easyQuestionsList = selectQuestions(
    questionData.data,
    "Easy",
    easyQuestionsCount
  );
  const mediumQuestionsList = selectQuestions(
    questionData.data,
    "Medium",
    mediumQuestionsCount
  );
  const hardQuestionsList = selectQuestions(
    questionData.data,
    "Hard",
    hardQuestionsCount
  );

  displayQuestions("easyQuestionsList", easyQuestionsList);
  displayQuestions("mediumQuestionsList", mediumQuestionsList);
  displayQuestions("hardQuestionsList", hardQuestionsList);

  // displayDifficultyCalculation(
  //   easyQuestionsCount,
  //   mediumQuestionsCount,
  //   hardQuestionsCount,
  //   questionData.data.length
  // );

  document.getElementById("easySection").style.display = "block";
  document.getElementById("mediumSection").style.display = "block";
  document.getElementById("hardSection").style.display = "block";
  // document.getElementById("difficultyCalculation").style.display = "block";
}

function selectQuestions(questions, difficulty, count) {
  const selectedQuestions = questions.filter(
    (question) => question[3] === difficulty
  );

  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedQuestions[i], selectedQuestions[j]] = [
      selectedQuestions[j],
      selectedQuestions[i],
    ];
  }

  return selectedQuestions.slice(0, count);
}

function displayQuestions(sectionId, questions) {
  const section = document.getElementById(sectionId);
  const questionList = document.createElement("ol");

  questions.forEach((question) => {
    const [text, category, subCategory, difficulty, marks] = question;

    const questionInfo = document.createElement("div");
    questionInfo.classList.add("row");

    questionInfo.innerHTML = `
      <div class="col-md-8">${text}</div>
      <div class="col-2 col-md-2">${category}</div>
      <div class="col-2 col-md-2">${marks} marks</div>
    `;

    const listItem = document.createElement("li");
    listItem.appendChild(questionInfo);
    questionList.appendChild(listItem);
  });

  section.innerHTML = "";
  section.appendChild(questionList);
}

// function displayDifficultyCalculation(
//   easyQuestions,
//   mediumQuestions,
//   hardQuestions,
//   totalQuestions
// ) {
//   const easyPercentage = ((easyQuestions / totalQuestions) * 100).toFixed(2);
//   const mediumPercentage = ((mediumQuestions / totalQuestions) * 100).toFixed(
//     2
//   );
//   const hardPercentage = ((hardQuestions / totalQuestions) * 100).toFixed(2);

//   const difficultyDetails = document.getElementById("difficultyDetails");
//   difficultyDetails.innerHTML = `
//       <p>Easy Questions: ${easyPercentage}%</p>
//       <p>Medium Questions: ${mediumPercentage}%</p>
//       <p>Hard Questions: ${hardPercentage}%</p>
//   `;
// }

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("submitButton")
  .addEventListener("click", onSubmitButtonClick);

// downloading data button

async function downloadFileFromGitHub() {
  const owner = "KhushiramMeena";
  const repo = "Question-Paper";
  const filePath = "data.json";

  const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;

  try {
    const response = await fetch(downloadUrl);
    const blob = await response.blob();

    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute("download", filePath.split("/").pop());
    downloadLink.click();
  } catch (error) {
    console.error("Error:", error);
  }
}
