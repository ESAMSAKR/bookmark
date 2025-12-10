var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var siteSubmit = document.getElementById("siteSubmit");

var valList;
if (localStorage.getItem("bookmark") != null) {
  valList = JSON.parse(localStorage.getItem("bookmark"));
  showValue();
} else {
  valList = [];
}

function takeValue() {
  // trim القيم عشان المسافات مش تعمل مشاكل
  var nameVal = siteName.value.trim();
  var urlVal = siteUrl.value.trim();

  // اتأكد الأول إن الفالديشن نفع
  if (!nameRegex(nameVal) || !urlRegex(urlVal)) {
    // لو فشل، ماتبعتش
    return;
  }

  // لو المستخدم ماكتبش http:// أو https://، هنضيف http:// تلقائياً عشان visit يفتح
  var normalizedUrl = urlVal;
  if (!/^https?:\/\//i.test(urlVal)) {
    normalizedUrl = "http://" + urlVal;
  }

  var bookmark = {
    name: nameVal,
    url: normalizedUrl,
  };

  valList.push(bookmark);
  localStorage.setItem("bookmark", JSON.stringify(valList));
  showValue();
  clearInputs();
}

function showValue() {
  var cartona = "";
  for (var i = 0; i < valList.length; i++) {
    cartona += `
      <tr>
        <td>${i + 1}</td>
        <td>${valList[i].name}</td>
        <td>${valList[i].url}</td>
        <td><button class="btn btn-warning" onclick="window.open('${
          valList[i].url
        }','_blank')">visit</button></td>
        <td><button class="btn btn-danger" onclick="deleteBookmark(${i})">delete</button></td>
      </tr>
      `;
  }
  document.getElementById("dvalue").innerHTML = cartona;
  // لازم نحفظ الفانكشن deleteBookmark في الscope العالمي علشان onclick inline يشتغل
  window.deleteBookmark = function (index) {
    valList.splice(index, 1);
    localStorage.setItem("bookmark", JSON.stringify(valList));
    showValue();
  };
}

function clearInputs() {
  siteName.value = "";
  siteUrl.value = "";
  // شيل الكلاسات لو حطيت قبل كده
  siteName.classList.remove("is-valid", "is-invalid");
  siteUrl.classList.remove("is-valid", "is-invalid");
}

// nameRegex يستقبل القيمة بدل الاعتماد على DOM داخل الفانكشن
function nameRegex() {
  var regexOne = /^[a-z0-9_-]{3,15}$/i; // i علشان يقبل Upper/Lower
  if (regexOne.test(siteName.value)) {
    siteName.classList.add("is-valid");
    siteName.classList.remove("is-invalid");
    return true;
  } else {
    siteName.classList.add("is-invalid");
    siteName.classList.remove("is-valid");
    return false;
  }
}

// urlRegex يسمح بـ http/https أو من غيرها، ويتحقق من الشكل العام للدومين واللاحقة
function urlRegex() {
  var regexsecond =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/i;
  if (regexsecond.test(siteUrl.value)) {
    siteUrl.classList.add("is-valid");
    siteUrl.classList.remove("is-invalid");
    return true;
  } else {
    siteUrl.classList.add("is-invalid");
    siteUrl.classList.remove("is-valid");
    return false;
  }
}
