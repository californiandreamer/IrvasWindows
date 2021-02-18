window.addEventListener('DOMContentLoaded', () => {
    "use strict"; //строгий режим в середині нашого файлу

    //змінна, котра показує стан нашого об'єкту
    let modalState = {};
    let deadline = '2020-06-20';

    changeModalState(modalState);
    modals();
    tabs('.glazing_slider', '.glazing_block', '.glazing_content', 'active');
    tabs('.decoration_slider', '.no_click', '.decoration_content > div > div', 'after_click');
    tabs('.balcon_icons', '.balcon_icons_img', '.big_img > img', 'do_image_more', 'inline-block');
    forms(modalState);
    timer('.container1', deadline);
    images();
});

//Images
const images = () => {
    const imgPopup = document.createElement('div'),
          workSection = document.querySelector('.works'),
          bigImage = document.createElement('img');

          imgPopup.classList.add('popup');
          workSection.appendChild(imgPopup);

          imgPopup.style.justifyContent = 'center';
          imgPopup.style.alignItems = 'center';
          imgPopup.style.display = 'none';

          bigImage.style.width = '80%';
          bigImage.style.maxWidth = '500px';
          bigImage.style.maxHeight = '500px';
          bigImage.style.objectFit = 'cover';

          imgPopup.appendChild(bigImage);

          workSection.addEventListener('click', (e) => {
              e.preventDefault();

              let target = e.target;

              if(target && target.classList.contains('preview')) {
                imgPopup.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                const path = target.parentNode.getAttribute('href');
                bigImage.setAttribute('src', path);
              }

              if(target && target.matches('div.popup')) {
                imgPopup.style.display = 'none';
                document.body.style.overflow = 'visible';
              }
          });

}

//Timer
const timer = (id, deadline) => {
    const addZero = (num) => {
        if(num <= 9) {
            return '0' + num;
        } else {
            return num;
        }
    };

    const getTimeRemaining = (endtime) => {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              seconds = Math.floor((t/1000) % 60),
              minutes = Math.floor((t/1000/60) % 60),
              hours = Math.floor((t/(1000 * 60 * 60)) % 24), 
              days = Math.floor((t/(1000 * 60 * 60 * 24)));
              
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    const setClock = (selector, endtime) => {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

              updateClock();

              function updateClock() {
                  const t = getTimeRemaining(endtime);

                  days.textContent = addZero(t.days);
                  hours.textContent = addZero(t.hours);
                  minutes.textContent = addZero(t.minutes);
                  seconds.textContent = addZero(t.seconds);

                  if (t.total <= 0) {
                    days.textContent = "00";
                    hours.textContent = "00";
                    minutes.textContent = "00";
                    seconds.textContent = "00";

                    clearInterval(timeInterval);
                  }
              }
    };

    setClock(id, deadline);
};

//checkNumInputs
const checkNumInputs = (selector) => {
    const numInputs = document.querySelectorAll(selector);

    //перевірка форми на введення чисел
    numInputs.forEach(item => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/\D/, '');
            if(item.value === "") {
                item.classList.add('empty');
            } else {
                item.classList.remove('empty');
            }
        });
    });
};

//changeModalState
const changeModalState = (state) => {
    //отримуємо всі 5 типів даних з яких ми будемо отримувати дані введені користувачем
    const windowForm = document.querySelectorAll('.balcon_icons_img'),
          windowWidth = document.querySelectorAll('#width'),
          windowHeight = document.querySelectorAll('#height'),
          windowType = document.querySelectorAll('#view_type'),
          windowProfile = document.querySelectorAll('.checkbox');

          //валідація(перевірка) введення
          checkNumInputs('#width');
          checkNumInputs('#height');

          //створюємо функцію, котра на певний елемент(elem), ставить певний обробник подій(event), і записує в певну властивість(prop)
          function bindActionToElems (event, elem, prop) {
            elem.forEach((item, i) => {
                item.addEventListener(event, () => {
                    switch(item.nodeName) {
                        case 'SPAN' :
                            //вказуємо номер елементу з яким взаємодіє користувач
                            state[prop] = i;
                            break;
                        case 'INPUT' :
                            if(item.getAttribute('type') === 'checkbox') {
                                i === 0 ? state[prop] = "Холодное" : state[prop] = "Теплое";
                                elem.forEach((box, j) => {
                                    box.checked = false;
                                    if (i == j) {
                                        box.checked = true;
                                    }
                                });
                            } else {
                                state[prop] = item.value;
                            }
                            break;
                        case 'SELECT' :
                            state[prop] = item.value;
                            break;
                    }

                    console.log(state);
                });
            });
          }

    bindActionToElems('click', windowForm, 'form');
    bindActionToElems('input', windowHeight, 'height');
    bindActionToElems('input', windowWidth, 'width');
    bindActionToElems('change', windowType, 'type');
    bindActionToElems('change', windowProfile, 'profile');
};

// Forms
const forms = (state) => {
    //отримуємо потрібні нам елементи
    const form = document.querySelectorAll('form'),
          input = document.querySelectorAll('input');

        //перевірка форми на введення чисел
        checkNumInputs('input[name="user_phone"]');

        //створюємо об'єкт з повідомленнями для користувача
        const message = {
            loading: 'Loading...',
            success: 'Thank you!',
            failure: 'Something went wrong'
        };
        
        //функція що відповідає за відправлення нашого запиту, додаємо оператори async - await з ES7
        const postData = async (url, data) => {
            document.querySelector('.status').textContent = message.loading;
            let res = await fetch(url, {
                method: "POST",
                body: data
            });

            return await res.text();
        };

        //функція очищення форм
        const clearInputs = () => {
            input.forEach(item => {
                item.value = '';
            });
        };

        //перефираємо всі фоми
        form.forEach(item => {
            item.addEventListener('submit', (e) => { //додаємо обробник подій submit
                e.preventDefault();

                //створюємо блок, котрий буде показувати користувачу що щось пішло не так, або що запит здійснився
                let statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                item.appendChild(statusMessage);

                //збираємо дані з форми
                const formData = new FormData(item);
                if (item.getAttribute('data-calc') === "end") {
                    for (let key in state) {
                        formData.append(key, state[key]);
                    }
                }
                
                //відправляємо запит на сервер по postData('адрес', дані з FormData)
                postData('assets/server.php', formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = message.success;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 5000)
                })
            });
        });
};

//Tabs
const tabs = (headerSelector, tabSelector, contentSelector, activeClass, display = 'block') => {
    const header = document.querySelector(headerSelector),
          tab = document.querySelectorAll(tabSelector),
          content = document.querySelectorAll(contentSelector);
    
        function hideTabContent() {
            content.forEach(item => {
                item.style.display = 'none';
            });
    
            tab.forEach(item => {
                item.classList.remove(activeClass);
            });
        }
    
        function showTabContent(i = 0) {
            content[i].style.display = display;
            tab[i].classList.add(activeClass);
        }
    
        hideTabContent();
        showTabContent();
    
        header.addEventListener('click', (e) => {
            const target = e.target;
            if(target.classList.contains(tabSelector.replace(/\./, "")) || 
            target.parentNode.classList.contains(tabSelector.replace(/\./, ""))) {
                tab.forEach((item, i) => {
                    if(target == item || target.parentNode == item) {
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });
    };

//Modals
const modals = () => {
        function bindModal(triggerSelector, modalSelector, closeSelector, closeClickOverlay = true) {
            const trigger = document.querySelectorAll(triggerSelector),
                  modal = document.querySelector(modalSelector),
                  close = document.querySelector(closeSelector),
                  windows = document.querySelectorAll('[data-modal]'),
                  scroll = calcScroll();
    
            trigger.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target) {
                        e.preventDefault();
                    }

                    windows.forEach(item => {
                        item.style.display = 'none';
                    });
        
                    modal.style.display = "block";
                    document.body.style.overflow = "hidden";
                    document.body.style.marginRight = `${scroll}px`;
                    // document.body.classList.add('modal-open');
                });
            });
    
            close.addEventListener('click', () => {
                windows.forEach(item => {
                    item.style.display = 'none';
                });

                modal.style.display = "none";
                document.body.style.overflow = "";
                document.body.style.marginRight = `0px`;
                // document.body.classList.remove('modal-open');
            });
    
            modal.addEventListener('click', (e) => {
                if (e.target === modal && closeClickOverlay) {
                    windows.forEach(item => {
                        item.style.display = 'none';
                    });

                    modal.style.display = "none";
                    document.body.style.overflow = "";
                    document.body.style.marginRight = `0px`;
                    // document.body.classList.remove('modal-open');
                }
            })
        }
    
            function showModalByTime(selector, time) {
                setTimeout(function() {
                    document.querySelector(selector).style.display = "block";
                    document.body.style.overflow = "hidden";
                }, time);
            }

            function calcScroll() {
                let div = document.createElement('div');

                div.style.width = '50px';
                div.style.height = '50px';
                div.style.overflowY = 'scroll';
                div.style.visibility = 'hidden';

                document.body.appendChild(div);
                let scrollWidth = div.offsetWidth - div.clientWidth;
                div.remove();

                return scrollWidth;
            }
              
              bindModal('.popup_engineer_btn', '.popup_engineer', '.popup_engineer .popup_close');
              bindModal('.phone_link', '.popup', '.popup .popup_close');
              bindModal('.popup_calc_btn', '.popup_calc', '.popup_calc_close');
              bindModal('.popup_calc_button', '.popup_calc_profile', '.popup_calc_profile_close', false);
              bindModal('.popup_calc_profile_button', '.popup_calc_end', '.popup_calc_end_close', false);
    //   showModalByTime('.popup', 10000);
};