/*
 * @Description:cesium_custom_popup
 * @Version: 1.0
 * @Autor: Kangweitao
 * @Date: 2023-09-24 17:47:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-18 13:05:45
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
      lineWidth = 3,
      lineHeight = 200,
      popupAt = "right",
      lineColor = "#49d182",
      borderColor = "#49d182",
      backgroundColor = "#49d18280",
      scale = 1.0,
      xyRatio = [3, 2],
    }
  ) {
    this.position = position;
    this.html = html;
    this.type = type;
    // 字典参数 popupLoactions
    const popupLoactions = {
      left: [0, xyRatio[0] * 50],
      center: [xyRatio[0] * 50 - lineWidth / 2, 0],
      right: [xyRatio[0] * 100 - lineWidth, -xyRatio[0] * 50],
    };
    this.popupLoaction = popupLoactions[popupAt];
    // 字典参数 popupTypes
    const popupTypes = {
      update: 1,
      common: 0,
      medium: 0,
      interaction: 0,
    };
    this.popupType = popupTypes[type];
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
    this.xyRatio = xyRatio;
    this.popupDom = null;
    this.closeEvent = null;
    this.clickEvent = null;
    this.mouseOverEvent = null;
    this.mouseOutEvent = null;
  }
  _initPopupDom(viewer) {
    // 创建弹窗初始结构
    const popupDom = document.createElement("div");
    this._initPopupDomInnerHTML(popupDom);
    // 核心代码
    const scene = viewer.scene;
    const popupLoaction = this.popupLoaction; //防止修改值
    const lineHeight = this.lineHeight; //防止修改值
    const scale = this.scale; //防止修改值
    const xyRatio = this.xyRatio; //防止修改值
    scene.postRender.addEventListener(() => {
      // 实时变更postion
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
        width:${xyRatio[0] * 100 * scale}px;
        height:${xyRatio[1] * 100 * scale}px;
        margin-left:${popupLoaction[1] * scale}px;
        margin-top:-${lineHeight * scale}px;
        transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);`;
      } catch (error) {}
      // 实时变更html-(只针对update类型弹窗)
      if (this.popupType) {
        this._initPopupDomInnerHTML(popupDom);
      }
    });
    this.popupDom = popupDom;
  }

  _initPopupDomInnerHTML(popupDom) {
    popupDom.innerHTML = `
      <div class="popup_warp" style="box-sizing:border-box;width:${
        this.xyRatio[0] * 100 * this.scale
      }px;height:${this.xyRatio[1] * 100 * this.scale}px;border:${
      3 * this.scale
    }px solid ${this.borderColor};">
          <div class="title" style="box-sizing:border-box;display:${
            this.showTitle ? "block" : "none"
          };position:absolute;left:0px;top:${
      0 * this.scale
    }px;z-index:999; width:${this.xyRatio[0] * 100 * this.scale}px;height:${
      30 * this.scale
    }px;padding-left:${15 * this.scale}px;text-align: start;line-height: ${
      30 * this.scale
    }px; color:white;font-size:${
      18 * this.scale
    }px;font-weight: bolder;cursor: pointer;caret-color: transparent;margin-left:${
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
      this.popupLoaction[0] * this.scale
    }px;top:${this.xyRatio[1] * 100 * this.scale}px;width:${
      this.lineWidth * this.scale
    }px;height:${this.lineHeight * this.scale}px;background-color: ${
      this.lineColor
    };border-bottom-left-radius: 100%;border-bottom-right-radius: 100%;"></div>
    </div>`;
  }

  _initClosePopupDomEvent(viewer) {
    const close = this.popupDom.childNodes[1].childNodes[3];
    close.addEventListener("click", (e) => {
      viewer.container.removeChild(this.popupDom);
      //执行自定义的关闭弹窗事件
      if (this.closeEvent) {
        this.closeEvent(e);
      }
    });
  }

  _initClickPopupDomEvent(viewer) {
    const content = this.popupDom.childNodes[1].childNodes[5];
    content.addEventListener("click", (e) => {
      // 执行自定义的鼠标点击弹窗事件
      if (this.clickEvent) {
        this.clickEvent(e);
      }
    });
  }

  _initMouseOverPopupDomEvent(viewer) {
    const content = this.popupDom.childNodes[1].childNodes[5];
    content.addEventListener("mouseover", (e) => {
      // 执行自定义的鼠标移入弹窗事件
      if (this.mouseOverEvent) {
        this.mouseOverEvent(e);
      }
    });
  }

  _initMouseOutPopupDomEvent(viewer) {
    const content = this.popupDom.childNodes[1].childNodes[5];
    content.addEventListener("mouseout", (e) => {
      // 执行自定义的鼠标移出弹窗事件
      if (this.mouseOutEvent) {
        this.mouseOutEvent(e);
      }
    });
  }

  addTo(viewer) {
    this._initPopupDom(viewer);
    this._initClosePopupDomEvent(viewer);
    this._initClickPopupDomEvent(viewer);
    this._initMouseOverPopupDomEvent(viewer);
    this._initMouseOutPopupDomEvent(viewer);
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

  onClickPopup(callback) {
    this.clickEvent = callback;
  }

  onMouseOverPopup(callback) {
    this.mouseOverEvent = callback;
  }

  onMouseOutPopup(callback) {
    this.mouseOutEvent = callback;
  }
}

export default CustomPopup;
