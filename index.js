/*
 * @Description:cesium_custom_popup
 * @Version: 1.0
 * @Autor: Kangweitao
 * @Date: 2023-09-24 17:47:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-25 12:00:52
 */

class CustomPopup {
  constructor(
    position,
    html,
    type,
    {
      title = "自定义普通弹窗",
      showTitle = true,
      showClose = true,
      lineHeight = 200,
      lineWidth = 3,
      popupAt = "right",
      lineColor = "#49d182",
      borderColor = "#49d182",
      backgroundColor = "#49d18280",
      scale = 1.0,
    }
  ) {
    this.position = position;
    this.html = html;
    this.type = type;
    this.title = title;
    this.showTitle = showTitle;
    this.showClose = showClose;
    this.lineHeight = lineHeight;
    this.lineWidth = lineWidth;
    this.popupAt = popupAt;
    this.lineColor = lineColor;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
    this.scale = scale;
    this.popupDom = null;
    this.closeEvent = null;
  }
  _initPopupDom(viewer) {
    // 字典参数
    const popupLoactions = {
      left: [0, 150],
      center: [150 - this.lineWidth / 2, 0],
      right: [300 - this.lineWidth, -150],
    };
    const popupTypes = {
      common: 1,
      video: 0,
    };
    // 创建弹窗初始结构
    const popupDom = document.createElement("div");
    popupDom.innerHTML = `
      <div class="popup_warp" style="box-sizing:border-box;width:${
        300 * this.scale
      }px;height:${200 * this.scale}px;border:${3 * this.scale}px solid ${
      this.borderColor
    };">
          <div class="title" style="box-sizing:border-box;display:${
            this.showTitle ? "block" : "none"
          };position:absolute;left:0px;top:${
      0 * this.scale
    }px;z-index:999; width:${300 * this.scale}px;height:${
      30 * this.scale
    }px;padding-right:30px;text-align: start;line-height: ${
      30 * this.scale
    }px; color:white;font-size:${
      26 * this.scale
    }px;font-weight: bolder;cursor: pointer;caret-color: transparent;margin-right:${
      0 * this.scale
    }px; border-radius: 0;background-color: ${
      this.borderColor
    }; white-space: nowrap;overflow: hidden; text-overflow: ellipsis; ">${
      this.title
    }</div>
          <div class="close" style="box-sizing:border-box;display:${
            this.showClose ? "block" : "none"
          };position:absolute;right:0px;top:${
      0 * this.scale
    }px;z-index:999; width:${30 * this.scale}px;height:${
      30 * this.scale
    }px;text-align: center;line-height: ${
      30 * this.scale
    }px; color:white;font-size:${
      30 * this.scale
    }px;cursor: pointer;caret-color: transparent;margin-right:${
      0 * this.scale
    }px; border-radius: 0;background-color: ${this.borderColor};" >×</div>
          <div class="content" style="box-sizing:border-box;width:100%;height:100%; background:${
            this.backgroundColor
          }; overflow: hidden;">
              <!-- 插入字符串html -->
              ${this.html}
          </div>
          <div class="line" style="box-sizing:border-box;position:absolute;left:${
            popupLoactions[this.popupAt][0] * this.scale
          }px;top:${200 * this.scale}px;width:${
      this.lineWidth * this.scale
    }px;height:${this.lineHeight * this.scale}px;background-color: ${
      this.lineColor
    };border-bottom-left-radius: 100%;border-bottom-right-radius: 100%;"></div>
      </div>`;
    // 核心代码
    const scale = this.scale; //防止scale被二次修改
    const popupAt = this.popupAt; //防止popupAt被二次修改
    const lineHeight = this.lineHeight; //防止lineHeight被二次修改
    const scene = viewer.scene;
    scene.postRender.addEventListener(() => {
      //实时变更postion
      let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        Cesium.Cartesian3.fromDegrees(...this.position)
      );
      try {
        let x = windowCoord.x - popupDom.offsetWidth / 2;
        let y = windowCoord.y - popupDom.offsetHeight;
        popupDom.style.cssText = `
        box-sizing:border-box;
        position:absolute;
        left:0px;
        top:0px;
        width:${300 * scale}px;
        height:${200 * scale}px;
        margin-left:${popupLoactions[popupAt][1] * scale}px;
        margin-top:-${lineHeight * scale}px;
        transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);`;
      } catch (error) {}
      //实时变更html
      let content = popupDom.childNodes[1].childNodes[5];
      if (popupTypes[this.type]) {
        content.innerHTML = this.html;
      }
    });
    this.popupDom = popupDom;
  }

  _initClosePopupDomEvent(viewer) {
    const close = this.popupDom.childNodes[1].childNodes[3];
    close.addEventListener("click", () => {
      viewer.container.removeChild(this.popupDom);
      //执行自定义的关闭弹窗事件
      if (this.closeEvent) {
        this.closeEvent();
      }
    });
  }

  addTo(viewer) {
    this._initPopupDom(viewer);
    this._initClosePopupDomEvent(viewer);
    viewer.container.append(this.popupDom);
  }

  removeFrom(viewer) {
    viewer.container.removeChild(this.popupDom);
  }

  updatePostion(position) {
    this.position = position;
  }

  updateHtml(html) {
    this.html = html;
  }

  onClosePopup(callback) {
    this.closeEvent = callback;
  }
}

export default CustomPopup;
