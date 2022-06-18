const createDraftPostingButton = ge("create_draft_job_posting");
createDraftPostingButton.addEventListener('click', createPosting);

const editDraftPostingButton = ge("edit_draft_posting_button");
editDraftPostingButton.addEventListener('click', editListing);

const saveDraftPostingButton = ge("save_draft_posting_button");
saveDraftPostingButton.addEventListener('click', saveJob);

const resetDraftPostingButton = ge("reset_draft_posting_button");
resetDraftPostingButton.addEventListener('click', editListing);

const approvePaymentCurrencyButton = ge("approve_payment_currency_button");
approvePaymentCurrencyButton.addEventListener('click', approveCurrency);

const buyJobPostingButton = ge("buy_job_posting_button");
buyJobPostingButton.addEventListener('click', buyPosting);

const postJobButton = ge("post_job_button");
postJobButton.addEventListener('click', postJobToJobCrypt);

const jobPostingCreateDisplay = ge("job_posting_create_display");

const jobPostingEdittDisplay = ge("job_posting_edit_display");

const jobPostingPaytDisplay = ge("job_posting_pay_display");

const jobPostingSaveDisplay = ge("job_posting_save_display");

const jobPostingPostDisplay = ge("job_posting_post_display");

const jobPostingProductSelect = ge("job_posting_product_select");

const jobPostingPaymentCurrencySelect = ge("job_posting_payment_currency_select");

const jobPostingDraftSelect = ge("edit_draft_job_posting_select");

const jobPostingDuration = ge("job_posting_duration_view");

const jobPostingFee = ge("job_posting_fee_view");

const jobPostingCurrency = ge("job_posting_currency_view");

const jobPostingCurrencyErc20Address = ge("job_posting_currency_erc20_address_view");

const usdcfaucetButtonSpan = ge("usdc_faucet_button_span");
const wethfaucetButtonSpan = ge("weth_faucet_button_span");

var selectedPostingAddress;
var selectedERC20Address;
var selectedPostingFee;


function loadPageData() {
    loadProducts();
    updateDraftListings();
    // REMOVE FOR LIVE
    loadFaucet();
}

// REMOVE FOR LIVE
const testUSDCAddress = "0xa836Abbbe9603665A2D86157D6ffde62AF98fD47";
const testWETHAddress = "0x42BE3516F6E3FfD233CeD5e01a036681aE11085D";

var usdcContract;
var wethContract;

async function loadFaucet() {
    usdcContract = new web3.eth.Contract(iErc20USDCAbi, testUSDCAddress);
    wethContract = new web3.eth.Contract(iErc20WETHAbi, testWETHAddress);
    console.log("checking faucet");
    // check the account has enough balance 
    usdcContract.methods.balanceOf(account).call({ from: account })
        .then(function(response) {
            console.log(response);
            if (response < (300 * 1e18)) {
                showUSDCFaucetButton();
            }
        })
        .catch(function(err) {
            console.log(err)
        });

    wethContract.methods.balanceOf(account).call({ from: account })
        .then(function(response) {
            if (response < (0.1 * 1e18)) {
                showWETHFaucetButton();
            }
        })
        .catch(function(err) {
            console.log(err);
        });


}


function showUSDCFaucetButton() {

    var faucetButton = ce("a");
    var icon = ce("i");
    icon.setAttribute("class", "fas fa-faucet");
    faucetButton.appendChild(icon);
    faucetButton.appendChild(text("USDC FAUCET"));
    faucetButton.setAttribute("href", "#");
    faucetButton.setAttribute("class", "btn-secondary");
    faucetButton.addEventListener('click', reloadFaucetFundsUSDC);
    usdcfaucetButtonSpan.appendChild(faucetButton);
}

function showWETHFaucetButton() {

    var faucetButton = ce("a");
    var icon = ce("i");
    icon.setAttribute("class", "fas fa-faucet");
    faucetButton.appendChild(icon);
    faucetButton.appendChild(text("WETH FAUCET"));
    faucetButton.setAttribute("href", "#");
    faucetButton.setAttribute("class", "btn-secondary");
    faucetButton.addEventListener('click', reloadFaucetFundsWETH);
    wethfaucetButtonSpan.appendChild(faucetButton);
}

async function reloadFaucetFundsUSDC() {
    // call mint function 
    usdcContract.methods.mint(account).send({ from: account })
        .then(function(response) {
            console.log(response);
            usdcfaucetButtonSpan.innerHTML = "USDC CREDITED- TOKEN CONTRACT : " + testUSDCAddress;
        })
        .catch(function(err) {
            console.log(err);
        });
}

async function reloadFaucetFundsWETH() {
    // call mint function 
    wethContract.methods.mint(account).send({ from: account })
        .then(function(response) {
            console.log(response);
            wethfaucetButtonSpan.innerHTML ="WETH CREDITED - TOKEN CONTRACT : " + testWETHAddress;
        })
        .catch(function(err) {
            console.log(err);
        });
}


// END REMOVE FOR LIVE

async function loadProducts() {
    clearSelect(jobPostingProductSelect);
    console.log(openProductCoreContract);
    openProductCoreContract.methods.getProducts().call({ from: account })
        .then(function(response) {
            console.log(response);
            var productAddresses = response;
            for (var x = 0; x < productAddresses.length; x++) {
                var productAddress = productAddresses[x];
                console.log(productAddress);
                populateProductSelect(productAddress, jobPostingProductSelect);
            }
        })
        .catch(function(err) {
            console.log(err);
        })
}

async function populateProductSelect(productAddress, jobPostingProductSelect) {
    console.log(productAddress);
    productContract = getContract(iOpenProductAbi, productAddress);
    console.log(productContract.options.address);
    populateProductSelectName(productContract, jobPostingProductSelect, productAddress);
}

async function populateProductSelectName(productContract, jobPostingProductSelect, productAddress) {
    productContract.methods.getName().call({ from: account })
        .then(function(response) {
            console.log(response);
            var name = response;
            console.log(productContract.options.address);
            populateProductSelectPrice(productContract, name, jobPostingProductSelect, productAddress);
        })
        .catch(function(err) {
            console.log(err);
        });
}

async function populateProductSelectPrice(productContract, name, jobPostingProductSelect, productAddress) {
    var price = 0;
    console.log(productContract.options.address);
    await productContract.methods.getPrice().call({ from: account })
        .then(function(response) {
            console.log(response + " :: " + name);
            price = response;
            populateProductSelectCurrency(productContract, name, price, jobPostingProductSelect, productAddress);
        })
        .catch(function(err) {
            console.log(err);
        })

}

async function populateProductSelectCurrency(productContract, name, price, jobPostingProductSelect, productAddress) {
    productContract.methods.getCurrency().call({ from: account })
        .then(function(response) {
            console.log(response);
            var currency = response;
            var option = document.createElement("option");
            var optionTxt = name + " - " + formatPrice(price) + " (" + currency + ")";
            var txt = document.createTextNode(optionTxt);
            option.appendChild(txt);
            option.setAttribute("value", productAddress);
            jobPostingProductSelect.appendChild(option);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function formatPrice(price) {
    return price / 1e18;
}

async function createPosting() {
    var productAddress = jobPostingProductSelect.value;
    console.log("product address :: " + productAddress);

    jcPostingFactoryContract.methods.createJobPosting(account, productAddress).send({ from: account })
        .then(function(response) {
            console.log(response);
            jobPostingCreateDisplay.innerHTML = "Draft Posting Created Txn :: " + response.blockHash;
            updateDraftListings();
        })
        .catch(function(err) {
            console.log(err);
        });
}

var t = new String("POSTED").valueOf();
var n = new String("CLOSED").valueOf();

async function updateDraftListings() {
    clearSelect(jobPostingDraftSelect);
    jcPostingFactoryContract.methods.findPostings(account).call({ from: account })
        .then(function(response) {
            console.log(response);
            var allPostings = response;
            if (allPostings.length > 0) {
                jobPostingDraftSelect.disabled = false;
                for (var x = 0; x < allPostings.length; x++) {
                    var postingAddress = allPostings[x];
                    processDraftPosting(postingAddress);
                }
            } else {
                appendNoDraftsFound(jobPostingDraftSelect);
            }
        })
        .catch(function(err) {
            console.log(err);
            appendNoDraftsFound(jobPostingDraftSelect);
        })
}

function appendNoDraftsFound(select) {
    var option = document.createElement("option");
    titleTxt = "No Drafts Found";
    var txt = document.createTextNode(titleTxt);
    option.appendChild(txt);
    select.appendChild(option);
    select.disabled = true;
}

function processDraftPosting(postingAddress) {
    console.log(postingAddress);
    var postingContract = getContract(iJCJobPostingAbi, postingAddress);
    postingContract.methods.getPostingStatus().call({ from: account })
        .then(function(response) {
            console.log(response);
            var status = response;
            var v = status.valueOf();
            console.log(postingAddress);

            if (v != t && v != n) {
                addDraftPostingOption(postingContract, postingAddress, status);
            }
        })
        .catch(function(err) {
            console.log(err);
        })
}

function addDraftPostingOption(postingContract, postingAddress, status) {
    var option = document.createElement("option");
    option.setAttribute("value", postingAddress);
    postingContract.methods.getFeature("JOB_TITLE").call({ from: account })
        .then(function(response) {
            console.log(response);
            var titleTxt = response;

            titleTxt = "Title :: " + titleTxt + " :: status :: " + status + " :: " + postingAddress;
            var txt = document.createTextNode(titleTxt);
            option.appendChild(txt);
            jobPostingDraftSelect.appendChild(option);
        })
}

function editListing() {

    var postingAddress = jobPostingDraftSelect.value;
    jobPostingEdittDisplay.innerHTML = "Editing Draft :: " + postingAddress;
    selectedPostingAddress = postingAddress;
    var title = ge("job_title");
    var locationType = ge("job_location_type");
    var locationSupport = ge("job_location_support");
    var workLocation = ge("job_work_location");
    var companyName = ge("company_name");
    var companyLink = ge("company_link");
    var companySummary = ge("company_summary");
    var skillsRequired = ge("job_skills_required");
    var searchCategories = ge("job_search_categories");
    var workType = ge("job_work_type");
    var salaryPaymenttype = ge("job_payment_type");
    var jobDescription = ge("job_description");
    var jobApplicationlink = ge("job_application_link");
    var userSearchTerms = ge("user_search_terms");

    postingContract = getContract(iJCJobPostingAbi, postingAddress);

    postingContract.methods.getFeature("JOB_TITLE").call({ from: account })
        .then(function(response) {
            console.log(response);
            title.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("JOB_LOCATION_TYPE").call({ from: account })
        .then(function(response) {
            console.log(response);
            locationType.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })


    postingContract.methods.getFeature("JOB_LOCATION_SUPPORT").call({ from: account })
        .then(function(response) {
            console.log(response);
            locationSupport.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })


    postingContract.methods.getFeature("JOB_WORK_LOCATION").call({ from: account })
        .then(function(response) {
            console.log(response);
            workLocation.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("COMPANY_NAME").call({ from: account })
        .then(function(response) {
            console.log(response);
            companyName.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("COMPANY_LINK").call({ from: account })
        .then(function(response) {
            console.log(response);
            companyLink.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("COMPANY_SUMMARY").call({ from: account })
        .then(function(response) {
            console.log(response);
            companySummary.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("JOB_WORK_TYPE").call({ from: account })
        .then(function(response) {
            console.log(response);
            workType.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("JOB_PAYMENT_TYPE").call({ from: account })
        .then(function(response) {
            console.log(response);
            salaryPaymenttype.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("JOB_DESCRIPTION").call({ from: account })
        .then(function(response) {
            console.log(response);
            fetchDescriptionFromIPFS(response, jobDescription);
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getFeature("USER_SEARCH_TERMS").call({ from: account })
        .then(function(response) {
            console.log(response);
            userSearchTerms.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getApplyLink().call({ from: account })
        .then(function(response) {
            console.log(response);
            jobApplicationlink.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })


    postingContract.methods.getSkillsRequired().call({ from: account })
        .then(function(response) {
            console.log(response);
            skillsRequired.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })

    postingContract.methods.getCategories().call({ from: account })
        .then(function(response) {
            console.log(response);
            searchCategories.value = response;
        })
        .catch(function(err) {
            console.log(err);
        })



    postingContract.methods.getProduct().call({ from: account })
        .then(function(response) {
            console.log(response);
            var productAddress = response;
            updatePaymentBox(productAddress, postingAddress);
        })
        .catch(function(err) {
            console.log(err);
        })
}

var productContract;

function updatePaymentBox(productAddress, postingAddress) {
    console.log(postingAddress);
    productContract = getContract(iOpenProductAbi, productAddress);
    console.log("product contract");
    console.log(productContract);
    productContract.methods.getFeatureUINTValue("DURATION").call({ from: account })
        .then(function(response) {
            console.log(response);
            var duration = response;
            var weeks = duration / (7 * 24 * 60 * 60);
            console.log(weeks);
            console.log(jobPostingDuration);
            jobPostingDuration.innerHTML = weeks + " Weeks ";
        })
        .catch(function(err) {
            console.log(err);
        });

    postingContract = getContract(iJCJobPostingAbi, postingAddress);
    postingContract.methods.getFee().call({ from: account })
        .then(function(response) {
            console.log(response);
            var fee = response._fee;
            var currency = response._erc20Currency;
            var erc20 = response._erc20Address;
            jobPostingFee.innerHTML = fee / 1e18;
            jobPostingCurrency.innerHTML = currency;
            jobPostingCurrencyErc20Address.innerHTML = erc20;

            selectedPostingAddress = postingAddress;
            selectedERC20Address = erc20;
            selectedPostingFee = fee;
        })
        .catch(function(err) {
            console.log(err);
        })

}

async function approveCurrency() {

    productContract.methods.getPrice().call({ from: account })
        .then(function(response) {
            console.log(response);
            var price = response;
            approve_1(productContract, price);
        })
        .catch(function(err) {
            console.log(err);
        });

}

async function approve_1(productContract, price) {
    productContract.methods.getErc20().call({ from: account })
        .then(function(response) {
            console.log(response);
            var erc20Address = response;
            approve_2(erc20Address, price);
        })
        .catch(function(err) {
            console.log(err);
        });
}

async function approve_2(erc20Address, price) {
    var erc20Contract = getContract(iERC20Abi, erc20Address);
    erc20Contract.methods.approve(jcPaymentManagerAddress, price).send({ from: account })
        .then(function(response) {
            console.log(response);
            jobPostingPaytDisplay.innerHTML = "Approved : " + response.blockHash;
        })
        .catch(function(err) {
            console.log(err);
        });
}


async function buyPosting() {

    if (selectedERC20Address == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
        jcPaymentManagerContract.methods.payForPosting(selectedPostingAddress).send({ from: account, value: selectedPostingFee })
            .then(function(response) {
                console.log(response);
                jobPostingPaytDisplay.innerHTML = "Paid :: " + response.blockHash;
            })
            .catch(function(err) {
                console.log(err);
                jobPostingPaytDisplay.innerHTML = "Payment Error :: " + err;
            })
    } else {
        jcPaymentManagerContract.methods.payForPosting(selectedPostingAddress).send({ from: account })
            .then(function(response) {
                console.log(response);
                jobPostingPaytDisplay.innerHTML = "Paid :: " + response.blockHash;
            })
            .catch(function(err) {
                console.log(err);
                jobPostingPaytDisplay.innerHTML = "Payment Error :: " + err;
            })
    }
}

async function saveJob() {
    jobJSON = getJobToPost();
    var hash;
    await ipfs.add(strfy(jobJSON.description))
        .then(function(response) {
            console.log(response);
            hash = response[0].hash;
            console.log(hash);
            saveToEVM(jobJSON, hash);
        })
        .catch(function(err) {
            console.log(err);
        });
}



async function saveToEVM(jobJSON, hash) {
    var featureNames = ["JOB_TITLE", "JOB_LOCATION_TYPE", "JOB_LOCATION_SUPPORT", "JOB_WORK_LOCATION", "COMPANY_NAME", "COMPANY_LINK", "COMPANY_SUMMARY", "JOB_WORK_TYPE", "JOB_PAYMENT_TYPE", "JOB_DESCRIPTION", "USER_SEARCH_TERMS"];
    var featureValues = [jobJSON.jobTitle + "", jobJSON.locationType + "", jobJSON.locationSupport + "", jobJSON.workLocation + "", jobJSON.companyName + "", jobJSON.companyLink, jobJSON.companySummary + "", jobJSON.workType + "", jobJSON.paymentType + "", hash + "", jobJSON.userSearchTerms + ""];
    console.log(featureNames);
    console.log(featureValues);
    var postingEditorContract = getContract(iJCJobPostingEditorAbi, selectedPostingAddress);

    var terms = [jobJSON.jobTitle + "", jobJSON.locationType + "", jobJSON.locationSupport + "", jobJSON.workLocation + "", jobJSON.companyName + "", jobJSON.workType + "", jobJSON.paymentType + ""]
    var c = decomposeText(jobJSON.companySummary);
    var u = decomposeText(jobJSON.userSearchTerms);
    var n = decomposeDescription(jobJSON.description);
    console.log(c);
    console.log(u);
    console.log(n);
    var searchTerms = unique(terms.concat(c).concat(u).concat(n));
    console.log(searchTerms);

    postingEditorContract.methods.populatePosting(featureNames, featureValues, jobJSON.searchCategories, jobJSON.skillsRequired, searchTerms, jobJSON.applicationLink).send({ from: account })
        .then(function(response) {
            console.log(response);
            jobPostingSaveDisplay.innerHTML = "Saved @> EVM :: " + response.blockHash + " :: IPFS :: " + hash;
        })
        .catch(function(err) {
            console.log(err);

        });

}

function getJobToPost() {
    var jobTitle = ge("job_title");
    console.log("jt: " + jobTitle);
    var locationType = ge("job_location_type");
    var locationSupport = ge("job_location_support");
    var workLocation = ge("job_work_location");
    var companyName = ge("company_name");
    var companyLink = ge("company_link");
    var companySummary = ge("company_summary");
    var skillsRequired = ge("job_skills_required");
    var searchCategories = ge("job_search_categories");
    var workType = ge("job_work_type");
    var paymentType = ge("job_payment_type");
    var description = ge("job_description");
    var quills = new Quill(description);
    var userSearchTerms = ge("user_search_terms");
    console.log(" jd : " + description);
    var applicationLink = ge("job_application_link");

    var jString = "{" + strfy("jobTitle") + ":" + strfy(jobTitle.value) + "," +
        strfy("locationType") + " : " + strfy(locationType.value) + "," +
        strfy("locationSupport") + " : " + strfy(locationSupport.value) + "," +
        strfy("workLocation") + " : " + strfy(workLocation.value) + "," +
        strfy("companyName") + " : " + strfy(companyName.value) + "," +
        strfy("companyLink") + " : " + strfy(companyLink.value) + "," +
        strfy("companySummary") + " : " + strfy(companySummary.value) + "," +
        strfy("skillsRequired") + " : [" + toJSONStringArray(skillsRequired.value) + "]," +
        strfy("searchCategories") + " : [" + toJSONStringArray(searchCategories.value) + "]," +
        strfy("workType") + " : " + strfy(workType.value) + "," +
        strfy("paymentType") + " : " + strfy(paymentType.value) + "," +
        strfy("description") + " : " + strfy(quills.getContents()) + "," +
        strfy("applicationLink") + " : " + strfy(applicationLink.value) + "," +
        strfy("userSearchTerms") + " : " + strfy(userSearchTerms.value) + "}";
    console.log(jString);
    var jobJSON = JSON.parse(jString);
    return jobJSON;
}

function strfy(value) {
    return JSON.stringify(value);
}

function toJSONStringArray(str) {
    var a = str.split(",");
    var b = "";
    for (var x = 0; x < a.length; x++) {
        b += "\"" + a[x] + "\"";
        if (x != a.length - 1) {
            b += ",";
        }
    }
    return b;
}

function postJobToJobCrypt() {
    console.log("posting job");
    saveJob();
    console.log("posting");
    console.log(jcJobCryptContract);
    console.log(selectedPostingAddress);
    var postingEditorContract = getContract(iJCJobPostingEditorAbi, selectedPostingAddress);
    postingEditorContract.methods.post().send({ from: account })
        .then(function(response) {
            console.log(response);
            jobPostingPostDisplay.innerHTML = " Job : " + selectedPostingAddress + " :: POSTED :: " + response.blockHash;
        })
        .catch(function(err) {
            console.log(err);
        });
}


async function fetchDescriptionFromIPFS(cid, quillDescription) {
    url = "https://ipfs.io/ipfs/" + cid;
    console.log(" url: " + url);
    let response = await fetch(url)
        .then(function(response) {
            console.log("ipfs");
            console.log(response);
            return response.text();
        })
        .then(function(text) {
            console.log(text);
            var quills = new Quill(quillDescription);
            quills.setContents(JSON.parse(text));
        })
        .catch(function(err) {
            console.log(err);
        });

}


async function fetchFromIPFS(cid, messageSpan) {
    url = "https://ipfs.io/ipfs/" + cid;
    console.log(" url: " + url);
    let response = await fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            messageSpan.innerHTML = text;
        });
}

function unique(array) {
    var q = new Set();
    for (var x = 0; x < array.length; x++) {
        q.add(array[x]);
    }
    return Array.from(q.values());
}

const filter = ["this", "is", "an", "role", "that", "will", "see", "you", "and", "highly", "active", "in", ",", "the", "a", "how", "when", "where", "who", "why", "then", "into", "insert", "as", "for", "to", "too", "two", "\n", "new", "out"];

function decomposeDescription(desc) {
    var ops = desc.ops;
    var duppedTerms = [];
    for (var x = 0; x < ops.length; x++) {
        var insert = ops[x].insert;
        console.log(insert);
        duppedTerms.concat(decomposeText(insert));
    }
    return unique(duppedTerms);
}

function decomposeText(text) {
    console.log(filter.length);
    console.log(text);
    // to lower case 
    var lower = text.toLowerCase();
    // split
    var array = lower.split(" ");
    // de-duplicate 
    var q = new Set();
    for (var x = 0; x < array.length; x++) {
        var val = array[x];

        if (val.includes(",")) {
            val = val.replace(",", "");
        }
        console.log("value: " + val + " filter " + filter.includes(val));

        if (!filter.includes(val)) {
            q.add(val);
        }
    }
    return Array.from(q.values());
}

function ce(element) {
    return document.createElement(element);
}

function text(txt) {
    return document.createTextNode(txt);
}

function ge(element) {
    return document.getElementById(element);
}